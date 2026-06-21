"""
수다 백엔드 API 테스트

단위 테스트: 인증(회원가입/로그인), 번역 기록 CRUD
통합 테스트: 회원가입 → 로그인 → 기록 저장 → 조회 → 삭제 전체 흐름
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ────────────────────────────────────────────
# 단위 테스트 — 회원가입
# ────────────────────────────────────────────

def test_register_success():
    """정상 회원가입"""
    res = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test1234"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["username"] == "testuser"


def test_register_duplicate_username():
    """중복 아이디 가입 차단"""
    res = client.post("/auth/register", json={
        "username": "testuser",
        "email": "other@example.com",
        "password": "test1234"
    })
    assert res.status_code == 400
    assert "아이디" in res.json()["detail"]


def test_register_duplicate_email():
    """중복 이메일 가입 차단"""
    res = client.post("/auth/register", json={
        "username": "newuser",
        "email": "test@example.com",
        "password": "test1234"
    })
    assert res.status_code == 400
    assert "이메일" in res.json()["detail"]


def test_register_invalid_email():
    """잘못된 이메일 형식 차단"""
    res = client.post("/auth/register", json={
        "username": "newuser2",
        "email": "notanemail",
        "password": "test1234"
    })
    assert res.status_code == 400


def test_register_short_password():
    """짧은 비밀번호 차단"""
    res = client.post("/auth/register", json={
        "username": "newuser3",
        "email": "new@example.com",
        "password": "123"
    })
    assert res.status_code == 400


# ────────────────────────────────────────────
# 단위 테스트 — 로그인
# ────────────────────────────────────────────

def test_login_success():
    """정상 로그인"""
    res = client.post("/auth/login", json={
        "username": "testuser",
        "password": "test1234"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password():
    """틀린 비밀번호 차단"""
    res = client.post("/auth/login", json={
        "username": "testuser",
        "password": "wrongpassword"
    })
    assert res.status_code == 401


def test_login_nonexistent_user():
    """존재하지 않는 아이디 차단"""
    res = client.post("/auth/login", json={
        "username": "nobody",
        "password": "test1234"
    })
    assert res.status_code == 401


# ────────────────────────────────────────────
# 단위 테스트 — 번역 기록
# ────────────────────────────────────────────

def test_history_requires_login():
    """비로그인 상태에서 기록 조회 차단"""
    res = client.get("/history/")
    assert res.status_code == 401


def test_history_add_and_get():
    """기록 저장 후 조회"""
    token = client.post("/auth/login", json={
        "username": "testuser", "password": "test1234"
    }).json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 저장
    res = client.post("/history/", json={
        "translation_type": "text",
        "input_words": '["안녕", "반갑다"]',
        "result": "안녕하세요, 반갑습니다!"
    }, headers=headers)
    assert res.status_code == 200
    item_id = res.json()["id"]

    # 조회
    res2 = client.get("/history/", headers=headers)
    assert res.status_code == 200
    assert any(h["id"] == item_id for h in res2.json())


def test_history_delete():
    """기록 삭제"""
    token = client.post("/auth/login", json={
        "username": "testuser", "password": "test1234"
    }).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 저장 후 삭제
    item = client.post("/history/", json={
        "translation_type": "webcam",
        "input_words": '["안녕"]',
        "result": "안녕하세요!"
    }, headers=headers).json()

    res = client.delete(f"/history/{item['id']}", headers=headers)
    assert res.status_code == 200
    assert res.json()["ok"] is True


# ────────────────────────────────────────────
# 통합 테스트 — 전체 사용자 시나리오
# ────────────────────────────────────────────

def test_full_user_scenario():
    """
    통합 테스트: 회원가입 → 로그인 → 번역 기록 저장 → 조회 → 삭제
    실제 사용자가 수다를 이용하는 전체 흐름을 검증
    """
    # 1. 회원가입
    reg = client.post("/auth/register", json={
        "username": "scenario_user",
        "email": "scenario@example.com",
        "password": "scenario1234"
    })
    assert reg.status_code == 200
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. 번역 기록 저장 (텍스트 번역)
    saved = client.post("/history/", json={
        "translation_type": "text",
        "input_words": '["사과", "주세요"]',
        "result": "사과 주세요."
    }, headers=headers)
    assert saved.status_code == 200
    item_id = saved.json()["id"]

    # 3. 기록 조회 — 저장한 항목이 있는지 확인
    history = client.get("/history/", headers=headers)
    assert history.status_code == 200
    ids = [h["id"] for h in history.json()]
    assert item_id in ids

    # 4. 기록 삭제 — 삭제 후 목록에서 사라지는지 확인
    client.delete(f"/history/{item_id}", headers=headers)
    history_after = client.get("/history/", headers=headers)
    ids_after = [h["id"] for h in history_after.json()]
    assert item_id not in ids_after
