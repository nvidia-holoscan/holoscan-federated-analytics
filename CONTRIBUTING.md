# Contributing to Holoscan Federated Analytics

Thank you for your interest in contributing to Holoscan Federated Analytics! We welcome contributions from the community to help improve and expand this project.

## Table of Contents

- [Contributing to Holoscan Federated Analytics](#contributing-to-holoscan-federated-analytics)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
  - [How to Contribute](#how-to-contribute)
  - [Submitting Changes](#submitting-changes)
    - [Signing Your Work](#signing-your-work)
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
5. Sign off on the commit ([Signing Your Work](#signing-your-work))
6. Push your changes to your fork on GitHub.
7. Submit a pull request to the main repository.
8. Request a review from the maintainers.

Please include a clear description of the changes and their purpose in your pull request.

### Signing Your Work

- We require that all contributors "sign-off" on their commits. This certifies that the contribution is your original work, or you have rights to submit it under the same license, or a compatible license.

- Any contribution which contains commits that are not Signed-Off will not be accepted.

  - To sign off on a commit you simply use the --signoff (or -s) option when committing your changes:

  ```bash
    $ git commit -s -m "Your commit message"
  ```

  - This will append the following to your commit message:

  ```
    Signed-off-by: Your Name <your@email.com>
  ```

- Full text of the DCO (Developer Certificate of Origin):

  ```
  Developer Certificate of Origin
  Version 1.1

  Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

  Everyone is permitted to copy and distribute verbatim copies of this
  license document, but changing it is not allowed.


  Developer's Certificate of Origin 1.1

  By making a contribution to this project, I certify that:

  (a) The contribution was created in whole or in part by me and I
      have the right to submit it under the open source license
      indicated in the file; or

  (b) The contribution is based upon previous work that, to the best
      of my knowledge, is covered under an appropriate open source
      license and I have the right under that license to submit that
      work with modifications, whether created in whole or in part
      by me, under the same open source license (unless I am
      permitted to submit under a different license), as indicated
      in the file; or

  (c) The contribution was provided directly to me by some other
      person who certified (a), (b) or (c) and I have not modified
      it.

  (d) I understand and agree that this project and the contribution
      are public and that a record of the contribution (including all
      personal information I submit with it, including my sign-off) is
      maintained indefinitely and may be redistributed consistent with
      this project or the open source license(s) involved.
  ```

## Coding Guidelines

- Follow the existing code style and conventions used in the project.
- Write clear, self-explanatory code with appropriate comments where necessary.
- Ensure your code is well-documented.
- Write unit tests for new functionality and ensure all tests pass before submitting a pull request.
- NVIDIA Copyright
  - All Holoscan Federated Analytics Open Source Software code should contain an NVIDIA copyright header that includes the current year. The following block of text should be prepended to the top of all OSS files. This includes all the source files which are compiled or interpreted.

    ```
    /*
     * SPDX-FileCopyrightText: Copyright (c) <year> NVIDIA CORPORATION & AFFILIATES. All rights reserved.
     * SPDX-License-Identifier: Apache-2.0
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    Or

    # SPDX-FileCopyrightText: Copyright (c) <year> NVIDIA CORPORATION & AFFILIATES. All rights reserved.
    # SPDX-License-Identifier: Apache-2.0
    #
    # Licensed under the Apache License, Version 2.0 (the "License");
    # you may not use this file except in compliance with the License.
    # You may obtain a copy of the License at
    #
    # http://www.apache.org/licenses/LICENSE-2.0
    #
    # Unless required by applicable law or agreed to in writing, software
    # distributed under the License is distributed on an "AS IS" BASIS,
    # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    # See the License for the specific language governing permissions and
    # limitations under the License.
    ```

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