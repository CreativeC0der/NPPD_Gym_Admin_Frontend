import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserExcelUpload from "@/components/UserExcelUpload";

const UserExcelUploadPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 p-6 text-white">
            <div className="mx-auto mb-8 max-w-7xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold">Bulk User Upload</h1>
                        <p className="text-slate-400">
                            Upload multiple users from Excel, review parsed data, then confirm submission.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/users/all")}
                        variant="outline"
                        className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to User List
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl">
                <UserExcelUpload />
            </div>
        </div>
    );
};

export default UserExcelUploadPage;
