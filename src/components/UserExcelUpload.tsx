import React, { useMemo, useRef, useState } from "react";
import api from "@/axios/axios-config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import type { CheckedState } from "@radix-ui/react-checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type UploadUserPayload = {
    name: string;
    age?: number;
    phone: string;
    email: string;
    password?: string;
    role: string;
    consent: boolean;
    privacyNoticeAccepted: boolean;
    joiningDate?: string;
    leavingDate?: string;
    reasonOfLeaving?: string;
    subscriptionType: string;
    isHiwoxMember: boolean;
    subscriptionRenewalDate?: string;
    gender: string;
    dateOfBirth?: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
};

type ParsedUser = UploadUserPayload & { __row: number };
type RowError = { row: number; errors: string[] };

const normalizeHeader = (value: string) =>
    value.toLowerCase().replace(/[\s._-]/g, "");

const getCellValue = (row: Record<string, unknown>, candidates: string[]) => {
    const entries = Object.entries(row).map(([key, value]) => [
        normalizeHeader(key),
        value,
    ] as const);
    for (const candidate of candidates) {
        const match = entries.find(([key]) => key === normalizeHeader(candidate));
        if (!match) continue;
        const value = match[1];
        if (value === null || value === undefined) continue;
        if (typeof value === "string" && value.trim() === "") continue;
        return value;
    }
    return undefined;
};

const parseBoolean = (value: unknown, fallback = false) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value !== "string") return fallback;
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(normalized)) return true;
    if (["false", "no", "n", "0"].includes(normalized)) return false;
    return fallback;
};

const parseCsvRows = (text: string): Record<string, unknown>[] => {
    const rows: string[][] = [];
    let currentCell = "";
    let currentRow: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === "," && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = "";
            continue;
        }

        if ((char === "\n" || char === "\r") && !inQuotes) {
            if (char === "\r" && nextChar === "\n") i += 1;
            currentRow.push(currentCell.trim());
            if (currentRow.some((cell) => cell.length > 0)) {
                rows.push(currentRow);
            }
            currentCell = "";
            currentRow = [];
            continue;
        }

        currentCell += char;
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell.length > 0)) {
            rows.push(currentRow);
        }
    }

    if (rows.length < 2) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
        const rowObj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
            rowObj[header] = row[index] ?? "";
        });
        return rowObj;
    });
};

const parseDateToIso = (value: unknown): string | undefined => {
    if (!value && value !== 0) return undefined;

    if (typeof value === "number") {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
        return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
    }

    if (typeof value === "string") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    }

    return undefined;
};

const parseRowToPayload = (row: Record<string, unknown>, rowNumber: number) => {
    const payload: ParsedUser = {
        __row: rowNumber,
        name: String(getCellValue(row, ["name", "fullName"]) ?? "").trim(),
        age: undefined,
        phone: String(getCellValue(row, ["phone", "phoneNumber"]) ?? "").trim(),
        email: String(getCellValue(row, ["email"]) ?? "").trim(),
        role: String(getCellValue(row, ["role"]) ?? "user").trim() || "user",
        consent: parseBoolean(getCellValue(row, ["consent"]), false),
        privacyNoticeAccepted: parseBoolean(
            getCellValue(row, ["privacyNoticeAccepted", "privacyAccepted"]),
            false
        ),
        joiningDate: parseDateToIso(getCellValue(row, ["joiningDate", "joinedOn"])),
        leavingDate: parseDateToIso(getCellValue(row, ["leavingDate"])),
        reasonOfLeaving: String(getCellValue(row, ["reasonOfLeaving"]) ?? "").trim() || undefined,
        subscriptionType:
            String(getCellValue(row, ["subscriptionType"]) ?? "basic").trim() || "basic",
        isHiwoxMember: false,
        subscriptionRenewalDate: parseDateToIso(
            getCellValue(row, ["subscriptionRenewalDate"])
        ),
        gender: String(getCellValue(row, ["gender"]) ?? "male").trim() || "male",
        dateOfBirth: parseDateToIso(getCellValue(row, ["dateOfBirth", "dob"])),
        address: {
            street: String(getCellValue(row, ["address.street", "street"]) ?? "").trim(),
            city: String(getCellValue(row, ["address.city", "city"]) ?? "").trim(),
            state: String(getCellValue(row, ["address.state", "state"]) ?? "").trim(),
            pincode: String(getCellValue(row, ["address.pincode", "pincode", "postalCode"]) ?? "").trim(),
        },
    };

    const ageCell = getCellValue(row, ["age"]);
    if (ageCell !== undefined && ageCell !== null && String(ageCell).trim() !== "") {
        const parsedAge = Number(ageCell);
        payload.age = Number.isNaN(parsedAge) ? undefined : parsedAge;
    }

    const errors: string[] = [];
    if (!payload.name) errors.push("Missing name");
    if (payload.age === undefined) errors.push("Invalid or missing age");
    if (!payload.phone) errors.push("Missing phone");
    if (!payload.email) errors.push("Missing email");
    if (!payload.joiningDate) errors.push("Invalid or missing joiningDate");
    if (!payload.dateOfBirth) errors.push("Invalid or missing dateOfBirth");
    if (!payload.address.street) errors.push("Missing address.street");
    if (!payload.address.city) errors.push("Missing address.city");
    if (!payload.address.state) errors.push("Missing address.state");
    if (!payload.address.pincode) errors.push("Missing address.pincode");

    return { payload, errors };
};

export default function UserExcelUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");
    const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
    const [rowErrors, setRowErrors] = useState<RowError[]>([]);
    const [hiwoxSelections, setHiwoxSelections] = useState<Record<number, boolean>>({});
    const [parsing, setParsing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const validCount = parsedUsers.length;
    const invalidCount = rowErrors.length;

    const previewRows = useMemo(() => parsedUsers, [parsedUsers]);
    const formatPreviewValue = (value: string | number | boolean | undefined) => {
        if (value === undefined) return "N/A";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        return String(value);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setParsedUsers([]);
        setRowErrors([]);
        setHiwoxSelections({});
        setIsConfirmed(false);

        if (!file) {
            setFileName("");
            return;
        }

        setParsing(true);
        setFileName(file.name);

        try {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            if (fileExtension !== "csv") {
                showErrorToast("Upload CSV exported from Excel (xlsx/xls parsing unavailable in this environment)");
                return;
            }

            const text = await file.text();
            const rawRows = parseCsvRows(text);

            if (rawRows.length === 0) {
                showErrorToast("No data found in sheet");
                return;
            }

            const nextUsers: ParsedUser[] = [];
            const nextErrors: RowError[] = [];
            const nextHiwoxSelections: Record<number, boolean> = {};

            rawRows.forEach((row, index) => {
                const rowNumber = index + 2;
                const { payload, errors } = parseRowToPayload(row, rowNumber);
                if (errors.length > 0) {
                    nextErrors.push({ row: rowNumber, errors });
                } else {
                    payload.isHiwoxMember = false;
                    nextUsers.push(payload);
                    nextHiwoxSelections[rowNumber] = false;
                }
            });

            setParsedUsers(nextUsers);
            setRowErrors(nextErrors);
            setHiwoxSelections(nextHiwoxSelections);

            if (nextUsers.length > 0) {
                showSuccessToast(`Parsed ${nextUsers.length} valid user row(s)`);
            } else {
                showErrorToast("No valid rows were parsed");
            }
        } catch (error) {
            console.error("Excel parse error:", error);
            showErrorToast("Failed to parse file. Please check format and headers.");
        } finally {
            setParsing(false);
        }
    };

    const handleConfirmChange = (checked: CheckedState) => {
        setIsConfirmed(checked === true);
    };

    const handleHiwoxSelectionChange = (rowNumber: number, checked: CheckedState) => {
        setHiwoxSelections((prev) => ({
            ...prev,
            [rowNumber]: checked === true,
        }));
    };

    const handleSubmit = async () => {
        if (!isConfirmed) {
            showErrorToast("Please confirm the parsed data before submitting");
            return;
        }

        if (parsedUsers.length === 0) {
            showErrorToast("No valid data to submit");
            return;
        }

        setSubmitting(true);
        try {
            const results = await Promise.allSettled(
                parsedUsers.map((user) => {
                    const userData = Object.fromEntries(
                        Object.entries(user).filter(([key]) => key !== "__row")
                    );
                    userData.isHiwoxMember = hiwoxSelections[user.__row] ?? false;
                    return api.post("/auth/register", userData);
                })
            );
            const successCount = results.filter((result) => result.status === "fulfilled").length;
            const failed = results.filter((result) => result.status === "rejected");

            if (failed.length > 0) {
                const firstError = failed[0] as PromiseRejectedResult;
                showErrorToast(
                    firstError.reason?.response?.data?.message ||
                    `${failed.length} user(s) failed to upload`
                );
            }

            if (successCount > 0) {
                showSuccessToast(`${successCount} user(s) uploaded successfully`);
            }
        } catch (error) {
            console.error("Bulk upload error:", error);
            showErrorToast("Bulk upload failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-2 text-xl font-semibold text-white">Upload User Excel</h2>
                <p className="mb-4 text-sm text-slate-400">
                    Upload CSV exported from Excel with headers matching Create User fields.
                </p>
                <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={parsing || submitting}
                    className="hidden"
                />
                <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={parsing || submitting}
                    className="bg-slate-700 text-white hover:bg-slate-600"
                >
                    {parsing ? "Parsing..." : "Choose CSV File"}
                </Button>
                {fileName ? (
                    <p className="mt-3 text-sm text-slate-300">
                        File: <span className="font-medium">{fileName}</span>
                    </p>
                ) : null}
                <p className="mt-4 text-xs text-slate-400">
                    Required headers: `name`, `age`, `phone`, `email`, `joiningDate`,
                    `dateOfBirth`, `address.street`, `address.city`, `address.state`, `address.pincode`
                </p>
            </div>

            {(validCount > 0 || invalidCount > 0) && (
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
                        <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-emerald-300">
                            Valid rows: {validCount}
                        </span>
                        <span className="rounded-md bg-red-500/20 px-2 py-1 text-red-300">
                            Invalid rows: {invalidCount}
                        </span>
                    </div>

                    {previewRows.length > 0 && (
                        <>
                            <h3 className="mb-3 text-lg font-semibold text-white">
                                Parsed Data Preview
                            </h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-700">
                                            <TableHead className="text-slate-300">Row</TableHead>
                                            <TableHead className="text-slate-300">Name</TableHead>
                                            <TableHead className="text-slate-300">Age</TableHead>
                                            <TableHead className="text-slate-300">Phone</TableHead>
                                            <TableHead className="text-slate-300">Email</TableHead>
                                            <TableHead className="text-slate-300">Role</TableHead>
                                            <TableHead className="text-slate-300">Consent</TableHead>
                                            <TableHead className="text-slate-300">Privacy Notice</TableHead>
                                            <TableHead className="text-slate-300">Joining Date</TableHead>
                                            <TableHead className="text-slate-300">Leaving Date</TableHead>
                                            <TableHead className="text-slate-300">Reason of Leaving</TableHead>
                                            <TableHead className="text-slate-300">Subscription Type</TableHead>
                                            <TableHead className="text-slate-300">Hiwox Member</TableHead>
                                            <TableHead className="text-slate-300">Renewal Date</TableHead>
                                            <TableHead className="text-slate-300">Gender</TableHead>
                                            <TableHead className="text-slate-300">Date of Birth</TableHead>
                                            <TableHead className="text-slate-300">Street</TableHead>
                                            <TableHead className="text-slate-300">City</TableHead>
                                            <TableHead className="text-slate-300">State</TableHead>
                                            <TableHead className="text-slate-300">Pincode</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewRows.map((user) => (
                                            <TableRow key={user.__row} className="border-slate-700">
                                                <TableCell className="text-slate-200">{user.__row}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.name)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.age)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.phone)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.email)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.role)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.consent)}</TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.privacyNoticeAccepted)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.joiningDate)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.leavingDate)}</TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.reasonOfLeaving)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.subscriptionType)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    <Checkbox
                                                        checked={hiwoxSelections[user.__row] ?? false}
                                                        onCheckedChange={(checked) =>
                                                            handleHiwoxSelectionChange(user.__row, checked)
                                                        }
                                                        disabled={submitting || parsing}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.subscriptionRenewalDate)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.gender)}</TableCell>
                                                <TableCell className="text-slate-200">{formatPreviewValue(user.dateOfBirth)}</TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.address.street)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.address.city)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.address.state)}
                                                </TableCell>
                                                <TableCell className="text-slate-200">
                                                    {formatPreviewValue(user.address.pincode)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}

                    {rowErrors.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-3 text-lg font-semibold text-white">Row Errors</h3>
                            <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-3">
                                {rowErrors.map((entry) => (
                                    <div key={entry.row} className="text-sm text-red-300">
                                        Row {entry.row}: {entry.errors.join(", ")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {parsedUsers.length > 0 && (
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="confirmParsedData"
                                    checked={isConfirmed}
                                    onCheckedChange={handleConfirmChange}
                                />
                                <label htmlFor="confirmParsedData" className="text-sm text-slate-200">
                                    I confirm the parsed user data is correct.
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!isConfirmed || submitting || parsing}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {submitting ? "Uploading..." : "Upload Parsed Users"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
