import React, { useState, useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useTodoStore } from '@/entities/todo';

export const AddTodoForm = React.memo(() => {
  const [inputText, setInputText] = useState('');
  const addTodo = useTodoStore(useCallback((state) => state.addTodo, []));

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputText.trim()) {
      const result = addTodo(inputText.trim());
      if (result) {
        setInputText('');
      }
    }
  }, [inputText, addTodo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        className="flex-1"
        aria-label="Add new todo"
      />
      <Button 
        type="submit" 
        disabled={!inputText.trim()}
        aria-label="Add todo"
      >
        Add
      </Button>
    </form>
  );
});