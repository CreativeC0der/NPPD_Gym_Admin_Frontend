import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreateUserForm from "../components/CreateUserForm";
import { Button } from "../components/ui/button";

const CreateUser: React.FC = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate("/users/all");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create New User</h1>
                        <p className="text-slate-400">Add a new user to the platform</p>
                    </div>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to User List
                    </Button>
                </div>
            </div>
            {/* Form Container */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
                    <CreateUserForm />
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
