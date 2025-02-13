# Contributing to Holoscan Federated Analytics

Thank you for your interest in contributing to Holoscan Federated Analytics! We welcome contributions from the community to help improve and expand this project.

## Table of Contents

- [Contributing to Holoscan Federated Analytics](#contributing-to-holoscan-federated-analytics)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
  - [How to Contribute](#how-to-contribute)
  - [Submitting Changes](#submitting-changes)
  - [Coding Guidelines](#coding-guidelines)
  - [Testing](#testing)
    - [Running unit tests](#running-unit-tests)
    - [Run code quality checks](#run-code-quality-checks)
  - [Documentation](#documentation)
  - [Community](#community)

## Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read and follow it to ensure a positive and inclusive environment for everyone.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Set up the development environment following the instructions in the README.md files.

## How to Contribute

There are several ways you can contribute to Holoscan Federated Analytics:

- Reporting bugs
- Suggesting enhancements
- Writing documentation
- Submitting code changes
- Reviewing pull requests

Before starting work on a significant contribution, please open an [issue](https://github.com/nvidia-holoscan/holoscan-federated-analytics/issues/) to discuss your ideas with the maintainers.

## Submitting Changes

1. Create a new branch for your changes.
2. Make your changes in the new branch.
3. Ensure your code follows our coding guidelines.
4. Write clear, concise commit messages explaining your changes.
5. Push your changes to your fork on GitHub.
6. Submit a pull request to the main repository.
7. Request a review from the maintainers.

Please include a clear description of the changes and their purpose in your pull request.

## Coding Guidelines

- Follow the existing code style and conventions used in the project.
- Write clear, self-explanatory code with appropriate comments where necessary.
- Ensure your code is well-documented.
- Write unit tests for new functionality and ensure all tests pass before submitting a pull request.

## Testing

- Run the existing test suite to ensure your changes don't break any existing functionality.
- Write new tests for any new features or bug fixes you implement.
- Ensure all tests pass before submitting your pull request.

### Running unit tests

```bash
    # Run below from the root directory
    pip3 install -r requirements.txt
    pytest
```

### Run code quality checks

```bash
    ./run lint

    # Fix any reported linting issues with:
    ./run fix
```
## Documentation

- Update the documentation to reflect any changes you make to the codebase.
- If you're adding new features, include appropriate documentation explaining how to use them.
- Ensure your documentation is clear, concise, and follows the existing documentation style.

## Community

- [Issue Tracker](https://github.com/nvidia-holoscan/holoscan-federated-analytics/issues)

We appreciate your contributions and look forward to your involvement in improving Holoscan Federated Analytics!