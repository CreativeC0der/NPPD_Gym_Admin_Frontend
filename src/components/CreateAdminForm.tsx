import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import api from '../axios/axios-config';
import { showSuccessToast, showErrorToast, showLoadingToast } from '../utils/toast';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';

// Zod validation schema
const createAdminSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 100 characters')
        .trim(),
    age: z
        .number()
        .min(18, 'Age must be at least 18')
        .max(100, 'Age must be at most 100'),
    phone: z
        .string()
        .regex(/^\d{10}$/, 'Phone must be exactly 10 digits')
        .trim(),
    email: z
        .string()
        .email('Please enter a valid email address')
        .trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters'),
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

interface CreateAdminFormProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

const CreateAdminForm: React.FC<CreateAdminFormProps> = ({ onClose, onSuccess }) => {
    const form = useForm<CreateAdminFormData>({
        resolver: zodResolver(createAdminSchema),
        defaultValues: {
            name: 'Admin User',
            age: 35,
            phone: '9876543210',
            email: 'admin@example.com',
            password: 'secureAdminPassword123'
        },
    });

    const onSubmit = async (data: CreateAdminFormData) => {
        try {
            showLoadingToast('Creating admin user...');

            const response = await api.post('/auth/register/admin', data);

            if (response.data) {
                showSuccessToast('Admin user created successfully!');

                // Reset form to default values
                form.reset();

                // Call success callback if provided
                if (onSuccess) {
                    onSuccess();
                }

                // Call close callback if provided
                if (onClose) {
                    onClose();
                }
            }
        } catch (error: any) {
            console.error('Error creating admin:', error);

            let errorMessage = 'Failed to create admin user';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            showErrorToast(errorMessage);
        }
    };

    return (
        <form id="create-admin-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <FieldContent>
                            <Input
                                {...field}
                                type="text"
                                id="name"
                                placeholder="Enter admin name"
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldDescription>Full name of the admin user</FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </FieldContent>
                    </Field>
                )}
            />

            {/* Age Field */}
            <Controller
                name="age"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="age">Age</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                id="age"
                                min="18"
                                max="100"
                                placeholder="Enter age"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                onBlur={field.onBlur}
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldDescription>Age must be between 18 and 100</FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </FieldContent>
                    </Field>
                )}
            />

            {/* Phone Field */}
            <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                        <FieldContent>
                            <Input
                                {...field}
                                type="tel"
                                id="phone"
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldDescription>10-digit phone number</FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </FieldContent>
                    </Field>
                )}
            />

            {/* Email Field */}
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <FieldContent>
                            <Input
                                {...field}
                                type="email"
                                id="email"
                                placeholder="Enter email address"
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldDescription>Admin's email address</FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </FieldContent>
                    </Field>
                )}
            />

            {/* Password Field */}
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <FieldContent>
                            <Input
                                {...field}
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldDescription>Minimum 8 characters</FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </FieldContent>
                    </Field>
                )}
            />

            {/* Submit Button */}
            <div className="pt-4">
                <Button
                    type="submit"
                    form="create-admin-form"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Admin...
                        </>
                    ) : (
                        'Create Admin User'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default CreateAdminForm;
