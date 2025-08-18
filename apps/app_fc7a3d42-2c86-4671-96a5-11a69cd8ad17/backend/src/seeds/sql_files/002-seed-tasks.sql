-- Seed data for tasks table
INSERT INTO tasks (title, description, status, "order") VALUES 
-- Todo tasks
('Set up development environment', 'Install Node.js, Docker, and configure development tools', 'todo', 1),
('Design database schema', 'Create ERD and define table relationships', 'todo', 2),
('Create user authentication system', 'Implement login, registration, and JWT handling', 'todo', 3),
('Setup CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'todo', 4),

-- In-progress tasks  
('Implement task management API', 'Create REST endpoints for CRUD operations on tasks', 'in-progress', 1),
('Build drag-and-drop interface', 'Develop kanban board with drag and drop functionality', 'in-progress', 2),
('Write unit tests', 'Add test coverage for services and repositories', 'in-progress', 3),

-- Done tasks
('Project setup and initialization', 'Initialize repository, setup basic project structure', 'done', 1),
('Choose tech stack', 'Research and decide on React, Node.js, PostgreSQL, TypeScript', 'done', 2),
('Create project documentation', 'Write README, setup guides, and API documentation', 'done', 3),
('Configure development database', 'Set up PostgreSQL instance and basic migrations', 'done', 4),
('Setup linting and formatting', 'Configure ESLint, Prettier, and pre-commit hooks', 'done', 5);

-- Update timestamps to make them look more realistic
UPDATE tasks SET 
  created_at = NOW() - INTERVAL '7 days' * RANDOM(),
  updated_at = NOW() - INTERVAL '3 days' * RANDOM()
WHERE status = 'done';

UPDATE tasks SET 
  created_at = NOW() - INTERVAL '5 days' * RANDOM(),
  updated_at = NOW() - INTERVAL '1 day' * RANDOM()
WHERE status = 'in-progress';

UPDATE tasks SET 
  created_at = NOW() - INTERVAL '2 days' * RANDOM(),
  updated_at = created_at
WHERE status = 'todo';