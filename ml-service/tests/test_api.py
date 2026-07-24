from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)
def test_health():
 r=client.get('/api/v1/health');assert r.status_code==200;assert r.json()['status']=='ok'
def test_profiles():
 r=client.get('/api/v1/profiles');assert r.status_code==200;assert len(r.json())>=10
def test_dashboard():
 r=client.get('/api/v1/profiles/ravi/dashboard');assert r.status_code==200;body=r.json();assert 300<=body['score']['score']<=900;assert len(body['score']['top_drivers'])==3
def test_assessment(monkeypatch):
 monkeypatch.setenv('ML_SERVICE_API_KEY','test')
 payload={'profile_id':'ravi','monthly_amount':2000,'years':3,'persist':False,'risk_profile':{'profile_id':'ravi','loss_reaction':2,'horizon_years':3,'emergency_fund_months':1.5,'monthly_income':28000,'monthly_expenses':22500,'income_stability':3,'liquidity_need_months':36,'investment_experience':1,'persist':False}}
 r=client.post('/api/v1/full-assessment',json=payload,headers={'X-API-Key':'test'});assert r.status_code==200;assert r.json()['recommendation']['plan'] in {'Conservative','Balanced','Growth'}


def test_custom_questionnaire_assessment(monkeypatch):
 monkeypatch.setenv("ML_SERVICE_API_KEY","test")
 payload={
  "profile_id":"questionnaire-user",
  "features":{
   "payment_consistency":92,
   "savings_ratio":0.20,
   "expense_ratio":0.72,
   "late_bill_count":1,
   "recharge_frequency":12,
   "upi_transactions":180,
   "wallet_transactions":25,
   "ecommerce_orders":8,
   "digital_activity_score":300,
   "financial_discipline":76,
   "monthly_income":45000,
   "age":24,
   "average_recharge_amount":399
  },
  "profile":{
   "name":"You",
   "role":"Salaried",
   "city":"Tier 2 City",
   "monthly_income":45000,
   "monthly_expenses":32400,
   "monthly_surplus":12600,
   "emergency_fund_months":2,
   "income_stability":5,
   "consent_sources":["self-reported questionnaire"]
  },
  "monthly_amount":3000,
  "years":3,
  "risk_profile":{
   "profile_id":"questionnaire-user",
   "loss_reaction":2,
   "horizon_years":3,
   "emergency_fund_months":2,
   "monthly_income":45000,
   "monthly_expenses":32400,
   "income_stability":5,
   "liquidity_need_months":18,
   "investment_experience":1,
   "persist":False
  },
  "persist":False
 }
 r=client.post(
  "/api/v1/full-assessment",
  json=payload,
  headers={"X-API-Key":"test"}
 )
 assert r.status_code==200
 body=r.json()
 assert body["profile"]["is_demo"] is False
 assert body["score"]["profile_id"]=="questionnaire-user"
 assert body["recommendation"]["plan"] in {
  "Conservative","Balanced","Growth"
 }
