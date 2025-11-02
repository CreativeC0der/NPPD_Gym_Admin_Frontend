import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldError,
} from '../components/ui/field';
import { ArrowLeft } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { Textarea } from '../components/ui/textarea';
import api from '../axios/axios-config';

// Zod validation schema - updated to match API structure
const createGymSchema = z.object({
    name: z
        .string()
        .min(3, 'Gym name must be at least 3 characters')
        .max(100, 'Gym name must be at most 100 characters'),
    address: z
        .string()
        .min(10, 'Address must be at least 10 characters')
        .max(200, 'Address must be at most 200 characters'),
    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 characters')
        .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    adminEmail: z
        .string()
        .email('Please enter a valid admin email address'),
    location: z.object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()).length(2, 'Coordinates must have longitude and latitude'),
    }),
    amenities: z.array(z.string()).min(1, 'Please add at least one amenity'),
    price: z.number().min(0, 'Price must be a positive number'),
    rating: z.number().min(0).max(5, 'Rating must be between 0 and 5').optional(),
});

type CreateGymFormData = z.infer<typeof createGymSchema>;

const CreateGym: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [amenitiesInput, setAmenitiesInput] = React.useState('');
    const [longitude, setLongitude] = React.useState('');
    const [latitude, setLatitude] = React.useState('');

    const form = useForm<CreateGymFormData>({
        resolver: zodResolver(createGymSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            email: '',
            adminEmail: '',
            location: {
                type: 'Point',
                coordinates: [0, 0],
            },
            amenities: [],
            price: 0,
            rating: 0,
        },
    });

    const onSubmit = async (data: CreateGymFormData) => {
        try {
            setIsSubmitting(true);

            // Make POST request to create gym
            const response = await api.post('/gyms', data);

            console.log('Gym created:', response.data);
            showSuccessToast('Gym created successfully!');
            form.reset();

        } catch (error: any) {
            console.error('Error creating gym:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create gym. Please try again.';
            showErrorToast(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create New Gym</h1>
                        <p className="text-slate-400">Add a new gym location to the platform</p>
                    </div>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gym List
                    </Button>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
                    <form id="create-gym-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Gym Information Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Gym Information</h2>

                            <FieldGroup>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Gym Name */}
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="name" className="text-slate-300">
                                                    Gym Name
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        {...field}
                                                        id="name"
                                                        type="text"
                                                        placeholder="FitZone Gym & Fitness"
                                                        aria-invalid={fieldState.invalid}
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <FieldDescription className="text-slate-400">
                                                        Enter the official name of the gym
                                                    </FieldDescription>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />

                                    {/* Admin Email */}
                                    <Controller
                                        name="adminEmail"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="adminEmail" className="text-slate-300">
                                                    Admin Email
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        {...field}
                                                        id="adminEmail"
                                                        type="email"
                                                        placeholder="admin@gmail.com"
                                                        aria-invalid={fieldState.invalid}
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <FieldDescription className="text-slate-400">
                                                        Email address of the gym administrator
                                                    </FieldDescription>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />
                                </div>

                                {/* Address */}
                                <Controller
                                    name="address"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="address" className="text-slate-300">
                                                Address
                                            </FieldLabel>
                                            <FieldContent>
                                                <Textarea
                                                    {...field}
                                                    id="address"
                                                    placeholder="123 Main Street, Downtown, Mumbai, Maharashtra 400001"
                                                    aria-invalid={fieldState.invalid}
                                                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    rows={3}
                                                />
                                                <FieldDescription className="text-slate-400">
                                                    Complete street address including city, state, and zip code
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </FieldContent>
                                        </Field>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <Controller
                                        name="phone"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="phone" className="text-slate-300">
                                                    Phone
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        {...field}
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="+91-9876543210"
                                                        aria-invalid={fieldState.invalid}
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <FieldDescription className="text-slate-400">
                                                        Main contact number for the gym
                                                    </FieldDescription>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />

                                    {/* Email */}
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="email" className="text-slate-300">
                                                    Gym Email
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        {...field}
                                                        id="email"
                                                        type="email"
                                                        placeholder="contact@fitzone.com"
                                                        aria-invalid={fieldState.invalid}
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <FieldDescription className="text-slate-400">
                                                        Primary email address for the gym
                                                    </FieldDescription>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />
                                </div>

                                {/* Location Coordinates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field>
                                        <FieldLabel htmlFor="longitude" className="text-slate-300">
                                            Longitude
                                        </FieldLabel>
                                        <FieldContent>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                placeholder="72.8777"
                                                value={longitude}
                                                onChange={(e) => {
                                                    setLongitude(e.target.value);
                                                    const val = parseFloat(e.target.value) || 0;
                                                    form.setValue('location.coordinates.0', val);
                                                }}
                                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                            <FieldDescription className="text-slate-400">
                                                Longitude coordinate of the gym location
                                            </FieldDescription>
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="latitude" className="text-slate-300">
                                            Latitude
                                        </FieldLabel>
                                        <FieldContent>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                placeholder="19.076"
                                                value={latitude}
                                                onChange={(e) => {
                                                    setLatitude(e.target.value);
                                                    const val = parseFloat(e.target.value) || 0;
                                                    form.setValue('location.coordinates.1', val);
                                                }}
                                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                            <FieldDescription className="text-slate-400">
                                                Latitude coordinate of the gym location
                                            </FieldDescription>
                                        </FieldContent>
                                    </Field>
                                </div>

                                {/* Amenities */}
                                <Field>
                                    <FieldLabel htmlFor="amenities" className="text-slate-300">
                                        Amenities
                                    </FieldLabel>
                                    <FieldContent>
                                        <Textarea
                                            id="amenities"
                                            placeholder="Swimming Pool, Sauna, Personal Training, Group Classes, Cardio Equipment (one per line)"
                                            value={amenitiesInput}
                                            onChange={(e) => {
                                                setAmenitiesInput(e.target.value);
                                                const amenitiesArray = e.target.value
                                                    .split('\n')
                                                    .map(item => item.trim())
                                                    .filter(item => item.length > 0);
                                                form.setValue('amenities', amenitiesArray);
                                            }}
                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                            rows={5}
                                        />
                                        <FieldDescription className="text-slate-400">
                                            Enter each amenity on a new line
                                        </FieldDescription>
                                    </FieldContent>
                                </Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Price */}
                                    <Controller
                                        name="price"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="price" className="text-slate-300">
                                                    Price (₹)
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        {...field}
                                                        id="price"
                                                        type="number"
                                                        placeholder="2999"
                                                        aria-invalid={fieldState.invalid}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <FieldDescription className="text-slate-400">
                                                        Monthly membership price
                                                    </FieldDescription>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />

                                    {/* Rating */}
                                    <Controller
                                        name="rating"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="rating" className="text-slate-300">
                                                    Rating (Optional)
                                                </FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        {...field}
                                                        id="rating"
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        placeholder="4.5"
                                                        aria-invalid={fieldState.invalid}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    <FieldDescription className="text-slate-400">
                                                        Rating out of 5 (0-5)
                                                    </FieldDescription>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />
                                </div>
                            </FieldGroup>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                variant="outline"
                                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    form.reset();
                                    setAmenitiesInput('');
                                    setLongitude('');
                                    setLatitude('');
                                }}
                                variant="outline"
                                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                form="create-gym-form"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Gym'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateGym;
