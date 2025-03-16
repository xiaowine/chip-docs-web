# GitHub Copilot Instructions

This file provides instructions for GitHub Copilot when working in this Vue/Vite project.

## Project Structure

- `wine-ui/`: UI component library
- `example/`: Demo and documentation site

## Technology Stack

- Vue 3
- TypeScript
- SCSS
- Vite

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define proper interfaces and types
- Use type inference when obvious

### Vue Components

- Use Composition API
- Follow Single File Component pattern
- Props must have type definitions
- Emit events with proper typing

### SCSS

- Use variables for colors and sizes
- Follow BEM naming convention
- Write modular and reusable styles

### General

- Write descriptive function and variable names
- Include JSDoc comments for components and methods
- Follow Vue style guide recommendations
- Keep components small and focused
- Write unit tests for components

## Best Practices

- Apply SOLID principles
- Use composables for shared logic
- Keep component logic in separate files
- Implement proper error handling
- Focus on accessibility features

## Theming

- Use variables from `wine-ui/styles/theme.scss`
- All component styles must support theming
- Define new theme variables in theme.scss
- Follow color palette and sizing system
- Test components with different themes
- Support dark mode by default
  - Define dark mode color variables
  - Use CSS custom properties for theme switching
  - Test all components in dark mode
  - Provide dark mode toggle utilities
  - Respect system color scheme preference

## Component Registration

- Register all components in `wine-ui/index.ts`
- Define plugin pattern with `install` method
- Export individual components for tree-shaking
- Export default plugin for Vue.use()
- Keep registration logic in a dedicated file
- Maintain component list in a single location
- Auto-import components using `wine-ui/index.ts`
- Follow Vue plugin registration conventions
- Support both global and local component usage
- Document plugin installation process

## Component Styles

- Write component styles in `index.scss` within component directory
- Use `@use` rule to import component styles
- Follow theme variables and mixins from global styles
- Scope styles to component namespace
- Import all component styles in main entry
