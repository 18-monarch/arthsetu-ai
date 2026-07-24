import type {
  QuestionnaireAnswers,
  ScoreResult,
} from "@/lib/types";

export interface ActionPlanWeek {
  week: number;
  title: string;
  action: string;
  target: string;
  potentialGain?: number;
}

const fallbackActions: ActionPlanWeek[] = [
  {
    week: 1,
    title: "Make spending visible",
    action: "Review the last 30 days and mark every non-essential expense.",
    target: "Identify at least three expenses to reduce or pause.",
  },
  {
    week: 2,
    title: "Protect every due date",
    action: "Set reminders or autopay for recurring bills.",
    target: "Complete the week without a missed payment.",
  },
  {
    week: 3,
    title: "Automate a small saving",
    action: "Move money to savings immediately after income arrives.",
    target: "Increase the monthly savings rate by 5 percentage points.",
  },
];

function actionTarget(feature: string, answers: QuestionnaireAnswers) {
  switch (feature) {
    case "savings_ratio":
      return `Move from ${answers.savings_percent}% toward ${Math.min(
        40,
        answers.savings_percent + 5,
      )}% savings.`;
    case "expense_ratio":
      return `Reduce monthly expenses by about ₹${Math.max(
        500,
        Math.round(answers.monthly_expenses * 0.05 / 100) * 100,
      ).toLocaleString("en-IN")}.`;
    case "late_bill_count":
    case "payment_consistency":
      return `Bring late bills from ${answers.late_bills_12m} to ${Math.max(
        0,
        answers.late_bills_12m - 1,
      )}.`;
    case "financial_discipline":
      return "Complete bill reminders, savings transfer and weekly expense review.";
    default:
      return "Complete one measurable improvement and track it for seven days.";
  }
}

export function build30DayPlan(
  score: ScoreResult,
  answers: QuestionnaireAnswers,
): ActionPlanWeek[] {
  const personalised = score.improvement_actions
    .filter((item) => item.feature !== "age")
    .slice(0, 3)
    .map<ActionPlanWeek>((item, index) => ({
      week: index + 1,
      title: item.label,
      action: item.action,
      target: actionTarget(item.feature, answers),
      potentialGain: Math.max(0, item.score_gain),
    }));

  while (personalised.length < 3) {
    personalised.push(fallbackActions[personalised.length]);
  }

  return [
    ...personalised,
    {
      week: 4,
      title: "Review and reassess",
      action:
        "Check what changed, repeat the questionnaire and compare the explanation—not only the number.",
      target: `Aim to improve from the current SetuScore of ${score.score}.`,
    },
  ];
}
