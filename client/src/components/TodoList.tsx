import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StudentProfile, insertTodoSchema } from "@shared/schema";
import { z } from "zod";

interface TodoListProps {
  studentProfile: StudentProfile;
}

// Define the form schema for task creation
const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  category: z.enum(["study", "application", "extracurricular", "research", "test_prep"]).default("study"),
  dueDate: z.string().optional(),
});

type CreateTodoFormData = z.infer<typeof createTodoSchema>;

export default function TodoList({ studentProfile }: TodoListProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "study",
      dueDate: "",
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: async (data: CreateTodoFormData) => {
      console.log("Creating todo with data:", data);
      const todoData = {
        title: data.title,
        description: data.description || "",
        priority: data.priority || "medium",
        category: data.category || "study",
        studentId: studentProfile.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      };
      console.log("Sending todo data:", todoData);
      const response = await apiRequest("POST", "/api/student/todos", todoData);
      return response.json();
    },
    onSuccess: (result) => {
      console.log("Todo created successfully:", result);
      queryClient.invalidateQueries({ queryKey: ["/api/student/todos"] });
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating todo:", error);
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateTodoFormData) => {
    createTodoMutation.mutate(data);
  };

  const { data: todos, isLoading } = useQuery({
    queryKey: ["/api/student/todos"],
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      const response = await apiRequest("PUT", `/api/student/todos/${todoId}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/todos"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update todo status.",
        variant: "destructive",
      });
    },
  });

  const handleToggleTodo = (todoId: number) => {
    toggleTodoMutation.mutate(todoId);
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (date < today) {
      return "Overdue";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "study":
        return "bg-blue-100 text-blue-800";
      case "application":
        return "bg-purple-100 text-purple-800";
      case "extracurricular":
        return "bg-green-100 text-green-800";
      case "research":
        return "bg-purple-100 text-purple-800";
      case "test_prep":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const todosArray = Array.isArray(todos) ? todos : [];
  const completedTodos = todosArray.filter((todo: any) => todo.isCompleted);
  const incompleteTodos = todosArray.filter((todo: any) => !todo.isCompleted);
  const totalTodos = todosArray.length;
  const completedCount = completedTodos.length;

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">This Week's To-Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">This Week's To-Do</CardTitle>
          <span className="text-sm text-gray-500">
            {completedCount} of {totalTodos} completed
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incompleteTodos.map((todo: any) => (
            <div
              key={todo.id}
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                todo.priority === "high" ? "border-l-4 border-red-500" : ""
              }`}
            >
              <Checkbox
                checked={todo.isCompleted}
                onCheckedChange={() => handleToggleTodo(todo.id)}
                disabled={toggleTodoMutation.isPending}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{todo.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {todo.dueDate && (
                    <span
                      className={`text-xs ${
                        isOverdue(todo.dueDate) ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      <Calendar className="inline mr-1 h-3 w-3" />
                      Due: {formatDueDate(todo.dueDate)}
                    </span>
                  )}
                  {todo.category && (
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(todo.category)}`}>
                      <Tag className="mr-1 h-3 w-3" />
                      {todo.category}
                    </Badge>
                  )}
                </div>
              </div>
              {todo.priority === "high" && (
                <Badge className="text-xs bg-red-100 text-red-800">
                  High Priority
                </Badge>
              )}
            </div>
          ))}

          {completedTodos.map((todo: any) => (
            <div
              key={todo.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={todo.isCompleted}
                onCheckedChange={() => handleToggleTodo(todo.id)}
                disabled={toggleTodoMutation.isPending}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 line-through">{todo.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {todo.dueDate && (
                    <span className="text-xs text-gray-400">
                      <Calendar className="inline mr-1 h-3 w-3" />
                      Due: {formatDueDate(todo.dueDate)}
                    </span>
                  )}
                  {todo.category && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      <Tag className="mr-1 h-3 w-3" />
                      {todo.category}
                    </Badge>
                  )}
                </div>
              </div>
              <Badge className="text-xs bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>
          ))}

          {totalTodos === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks found.</p>
              <p className="text-sm mt-1">Add your first task to get started!</p>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full mt-4 border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter task description" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="study">Study</SelectItem>
                            <SelectItem value="application">Application</SelectItem>
                            <SelectItem value="extracurricular">Extracurricular</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="test_prep">Test Prep</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createTodoMutation.isPending}
                  >
                    {createTodoMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
