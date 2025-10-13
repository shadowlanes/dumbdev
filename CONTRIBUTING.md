# Contributing to webdev

Thank you for your interest in contributing to the webdev monorepo!

## Monorepo Structure

This repository is organized as a monorepo containing multiple independent micro apps for web developers. Each app is located in the `apps/` directory and is completely self-contained.

## Adding a New App

To add a new micro app to the monorepo:

1. **Create a new directory** under `apps/` with a descriptive name (use kebab-case):
   ```bash
   mkdir apps/your-app-name
   ```

2. **Add required files** for your app:
   - `README.md` - Describe what your app does, how to install and use it
   - `LICENSE` - Include licensing information (MIT recommended for consistency)
   - `.gitignore` - Specify files to ignore for your app's technology stack
   - Source code and dependencies as needed

3. **Make your app independent**:
   - Each app should have its own dependencies (package.json, requirements.txt, etc.)
   - Each app should be deployable independently
   - Each app should have its own build/test configuration
   - Avoid dependencies between apps

4. **Update documentation**:
   - Add your app to the list in `apps/README.md`
   - Ensure your app's README clearly explains its purpose and usage

## App Guidelines

- **Focus**: Each app should solve a specific problem for web developers
- **Independence**: Apps should not depend on each other
- **Documentation**: Include clear README with installation and usage instructions
- **Licensing**: Include a LICENSE file (MIT recommended)
- **Size**: Keep apps small and focused (micro apps)
- **Testing**: Include tests where applicable

## Deployment

Each app in this monorepo will be deployed separately. Make sure your app:
- Can be built/deployed independently
- Has clear deployment instructions in its README
- Doesn't require other apps from the monorepo to function

## Questions?

If you have questions about contributing, please open an issue in the repository.
