import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import api from "@/axios/axios-config";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface WellnessQuestion {
    id: string;
    field: string;
    label: string;
    type: "number" | "dropdown" | "scale";
    min?: number;
    max?: number;
    unit?: string;
    optional?: boolean;
    invertedScore?: boolean;
    options?: string[];
    lowLabel?: string;
    highLabel?: string;
}

interface WellnessDomain {
    id: string;
    label: string;
    icon?: string;
    color?: string;
    gradientColors?: string[];
    questions: WellnessQuestion[];
}

interface WellnessQuestionsResponse {
    success: boolean;
    domains: WellnessDomain[];
}

type AnswerValue = string | number | undefined;

type AnswersState = Record<string, AnswerValue>;

const getGradient = (domain: WellnessDomain) => {
    if (domain.gradientColors && domain.gradientColors.length >= 2) {
        return `linear-gradient(135deg, ${domain.gradientColors[0]}, ${domain.gradientColors[1]})`;
    }
    if (domain.color) {
        return `linear-gradient(135deg, ${domain.color}, ${domain.color})`;
    }
    return "linear-gradient(135deg, #334155, #475569)";
};

const getScaleValue = (question: WellnessQuestion, answers: AnswersState) => {
    const value = answers[question.field];
    if (typeof value === "number") return value;
    if (typeof question.min === "number") return question.min;
    if (typeof question.max === "number") return Math.floor(question.max / 2);
    return 0;
};

const formatRange = (question: WellnessQuestion) => {
    if (typeof question.min === "number" && typeof question.max === "number") {
        const unit = question.unit ? ` ${question.unit}` : "";
        return `Range: ${question.min} - ${question.max}${unit}`;
    }
    return question.unit ? `Unit: ${question.unit}` : undefined;
};

interface WellnessRecordFormProps {
    userId?: string | null;
}

const WellnessRecordForm: React.FC<WellnessRecordFormProps> = ({ userId }) => {
    const [domains, setDomains] = useState<WellnessDomain[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [answers, setAnswers] = useState<AnswersState>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const { data } = await api.get<WellnessQuestionsResponse>("/checkin/questions");
                const domainList = data?.domains ?? [];
                setDomains(domainList);
                setExpanded((prev) => {
                    if (Object.keys(prev).length > 0) return prev;
                    return domainList.reduce<Record<string, boolean>>((acc, domain, index) => {
                        acc[domain.id] = index === 0;
                        return acc;
                    }, {});
                });
            } catch (err: any) {
                showErrorToast(err?.response?.data?.message || "Failed to load wellness questions");
                setDomains([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const questionCount = useMemo(() => {
        return domains.reduce((total, domain) => total + (domain.questions?.length ?? 0), 0);
    }, [domains]);

    const toggleDomain = (domainId: string) => {
        setExpanded((prev) => ({
            ...prev,
            [domainId]: !prev[domainId],
        }));
    };

    const handleAnswerChange = (field: string, value: AnswerValue) => {
        setAnswers((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!userId) {
            showErrorToast("Select a member before submitting.");
            return;
        }

        const answerPayload = domains.flatMap((domain) =>
            domain.questions
                .map((question) => {
                    const rawValue = answers[question.field];
                    if (rawValue === undefined || rawValue === "") return null;

                    let value: string | number = rawValue as string | number;
                    if (question.type === "number" || question.type === "scale") {
                        value = typeof rawValue === "number" ? rawValue : Number(rawValue);
                    }

                    return {
                        questionId: question.id,
                        value,
                    };
                })
                .filter((item): item is { questionId: string; value: string | number } => item !== null)
        );

        if (!answerPayload.length) {
            showErrorToast("Provide at least one answer before submitting.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post("/checkin/submit", {
                userId,
                answers: answerPayload,
            });
            showSuccessToast("Wellness record submitted.");
            setAnswers({});
        } catch (err: any) {
            showErrorToast(err?.response?.data?.message || "Failed to submit wellness record");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-slate-300">Loading wellness questions...</div>;
    }

    if (!domains.length) {
        return <div className="text-slate-300">No wellness questions available.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{domains.length} domains</span>
                <span>{questionCount} questions</span>
            </div>
            {domains.map((domain) => {
                const isExpanded = expanded[domain.id];
                return (
                    <div key={domain.id} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                        <button
                            type="button"
                            onClick={() => toggleDomain(domain.id)}
                            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-700/40"
                            style={{ backgroundImage: getGradient(domain) }}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl" aria-hidden="true">{domain.icon ?? ""}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{domain.label}</h3>
                                    <p className="text-sm text-white/80">{domain.questions?.length ?? 0} questions</p>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 text-white transition-transform",
                                    isExpanded ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        {isExpanded && (
                            <div className="space-y-6 bg-slate-900/60 px-6 py-6">
                                <FieldGroup>
                                    {domain.questions.map((question) => {
                                        const rangeLabel = formatRange(question);
                                        const requiredLabel = question.optional ? "" : " *";

                                        return (
                                            <Field key={question.id}>
                                                <FieldLabel className="text-slate-200">
                                                    {question.label}
                                                    {requiredLabel}
                                                </FieldLabel>
                                                <FieldContent>
                                                    {question.type === "number" && (
                                                        <Input
                                                            type="number"
                                                            min={question.min}
                                                            max={question.max}
                                                            value={answers[question.field] ?? ""}
                                                            onChange={(event) => handleAnswerChange(question.field, event.target.value)}
                                                            placeholder={question.unit ? `Enter value (${question.unit})` : "Enter value"}
                                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                        />
                                                    )}
                                                    {question.type === "dropdown" && (
                                                        <Select
                                                            value={typeof answers[question.field] === "string" ? (answers[question.field] as string) : ""}
                                                            onValueChange={(value) => handleAnswerChange(question.field, value)}
                                                        >
                                                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                                <SelectValue placeholder="Select an option" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {(question.options ?? []).map((option) => (
                                                                    <SelectItem key={option} value={option}>
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    {question.type === "scale" && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                                <span>{question.lowLabel ?? "Low"}</span>
                                                                <span className="text-sm font-semibold text-slate-100">
                                                                    {getScaleValue(question, answers)}
                                                                </span>
                                                                <span>{question.highLabel ?? "High"}</span>
                                                            </div>
                                                            <Slider
                                                                min={question.min ?? 0}
                                                                max={question.max ?? 10}
                                                                step={1}
                                                                value={[getScaleValue(question, answers)]}
                                                                onValueChange={(value) => handleAnswerChange(question.field, value[0])}
                                                            />
                                                        </div>
                                                    )}
                                                    {rangeLabel && (
                                                        <FieldDescription className="text-slate-400">
                                                            {rangeLabel}
                                                        </FieldDescription>
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        );
                                    })}
                                </FieldGroup>
                            </div>
                        )}
                    </div>
                );
            })}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={!userId || submitting}
                    className="bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-60"
                >
                    {submitting ? "Submitting..." : "Submit Wellness Record"}
                </Button>
            </div>
        </form>
    );
};

export default WellnessRecordForm;
