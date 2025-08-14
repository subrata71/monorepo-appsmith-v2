import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

interface AddHabitFormData {
  name: string;
}

interface AddHabitFormProps {
  onAddHabit: (name: string) => void;
}

export const AddHabitForm = React.memo<AddHabitFormProps>(({ onAddHabit }) => {
  const form = useForm<AddHabitFormData>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    (data: AddHabitFormData) => {
      const trimmedName = data.name.trim();
      if (trimmedName) {
        onAddHabit(trimmedName);
        form.reset();
      }
    },
    [onAddHabit, form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: 'Habit name is required',
            maxLength: {
              value: 50,
              message: 'Habit name must be 50 characters or less',
            },
            validate: (value: string) => {
              const trimmed = value.trim();
              if (!trimmed) return 'Habit name cannot be empty';
              return true;
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter a new habit..."
                  autoFocus
                  maxLength={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Add Habit
        </Button>
      </form>
    </Form>
  );
});
