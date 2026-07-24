from __future__ import annotations

import json
from pathlib import Path
from types import SimpleNamespace


DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "profiles.json"
PROFILES: list[SimpleNamespace] = []


def _clip(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _normalise_features(profile: dict) -> dict[str, float]:
    """
    The curated demo profiles were created for ArthSetu's earlier alternative-
    data model. The teammate's trained credit model uses the questionnaire's
    newer 13-feature contract. Convert only those synthetic demo profiles into
    the new contract so the dashboard and profile endpoints remain usable.

    Real questionnaire users already send the new features directly and do not
    pass through this conversion.
    """
    features = dict(profile["features"])

    if "payment_consistency" in features:
        return {key: float(value) for key, value in features.items()}

    income = float(profile["monthly_income"])
    expenses = float(profile["monthly_expenses"])

    utility_on_time = _clip(
        float(features.get("utility_on_time_ratio", 0.80)),
        0.0,
        1.0,
    )
    failed_payment_ratio = _clip(
        float(features.get("failed_payment_ratio", 0.08)),
        0.0,
        1.0,
    )
    recharge_regularity = _clip(
        float(features.get("recharge_regularity", 0.75)),
        0.0,
        1.0,
    )
    transaction_stability = _clip(
        float(features.get("transaction_stability", 0.60)),
        0.0,
        1.0,
    )
    cashflow_volatility = _clip(
        float(features.get("cashflow_volatility", 0.45)),
        0.0,
        1.0,
    )
    savings_rate = _clip(
        float(features.get("savings_rate", 0.10)),
        0.0,
        1.0,
    )
    commerce_frequency = _clip(
        float(features.get("commerce_frequency", 6.0)),
        0.0,
        30.0,
    )
    digital_tenure_months = _clip(
        float(features.get("digital_tenure_months", 18.0)),
        0.0,
        120.0,
    )
    recharge_volatility = _clip(
        float(features.get("recharge_amount_volatility", 0.30)),
        0.0,
        1.0,
    )

    payment_consistency = _clip(
        utility_on_time * (1.0 - failed_payment_ratio * 0.45) * 100.0,
        0.0,
        100.0,
    )
    expense_ratio = _clip(
        expenses / max(income, 1.0),
        0.0,
        1.5,
    )
    late_bill_count = _clip(
        round((1.0 - utility_on_time) * 12.0 + failed_payment_ratio * 6.0),
        0.0,
        12.0,
    )
    recharge_frequency = _clip(
        round(recharge_regularity * 12.0, 2),
        0.0,
        15.0,
    )
    upi_transactions = _clip(
        round(transaction_stability * 300.0),
        0.0,
        600.0,
    )
    wallet_transactions = _clip(
        round(commerce_frequency * 3.0),
        0.0,
        120.0,
    )
    ecommerce_orders = _clip(
        round(commerce_frequency),
        0.0,
        30.0,
    )
    digital_activity_score = _clip(
        upi_transactions * 0.8
        + wallet_transactions * 2.0
        + ecommerce_orders * 10.0
        + digital_tenure_months * 2.0,
        0.0,
        800.0,
    )
    financial_discipline = _clip(
        payment_consistency * 0.45
        + savings_rate * 100.0 * 0.30
        + transaction_stability * 100.0 * 0.15
        + (1.0 - cashflow_volatility) * 10.0,
        0.0,
        100.0,
    )
    age = _clip(
        25.0 + digital_tenure_months / 12.0 * 2.0,
        18.0,
        55.0,
    )
    average_recharge_amount = _clip(
        299.0 + recharge_regularity * 180.0
        + (1.0 - recharge_volatility) * 40.0,
        0.0,
        1000.0,
    )

    return {
        "payment_consistency": payment_consistency,
        "savings_ratio": savings_rate,
        "expense_ratio": expense_ratio,
        "late_bill_count": late_bill_count,
        "recharge_frequency": recharge_frequency,
        "upi_transactions": upi_transactions,
        "wallet_transactions": wallet_transactions,
        "ecommerce_orders": ecommerce_orders,
        "digital_activity_score": digital_activity_score,
        "financial_discipline": financial_discipline,
        "monthly_income": income,
        "age": age,
        "average_recharge_amount": average_recharge_amount,
    }


def _load() -> None:
    global PROFILES

    if PROFILES:
        return

    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    PROFILES = [
        SimpleNamespace(
            id=profile["profile_id"],
            name=profile["name"],
            role=profile["role"],
            city=profile["city"],
            monthly_income=profile["monthly_income"],
            monthly_expenses=profile["monthly_expenses"],
            emergency_fund_months=profile["emergency_fund_months"],
            income_stability=profile["income_stability"],
            features=_normalise_features(profile),
            consent=profile["consent"],
        )
        for profile in raw
    ]


def list_profiles() -> list[SimpleNamespace]:
    _load()
    return sorted(PROFILES, key=lambda profile: profile.name)


def get_profile(profile_id: str) -> SimpleNamespace:
    _load()

    for profile in PROFILES:
        if profile.id == profile_id:
            return profile

    raise KeyError(f"Profile '{profile_id}' not found")
