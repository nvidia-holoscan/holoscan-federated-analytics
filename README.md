# Welcome to NVIDIA Holoscan Federated Analytics!

This is a repository for all the resources related to Holoscan Federated Analytics.

Federated Analytics is an approach to user data analytics that combines information from distributed datasets without gathering it at a central location.

[NVIDIA Holoscan](https://developer.nvidia.com/holoscan-sdk) is normally deployed on a fleet of IGX devices. A goal of Holoscan Federated Analytics is to provide Holoscan customers a feature where Holoscan customers can capture and analyze specific metrics for Holoscan applications deployed on a fleet of IGX devices. This will be demonstrated with a sample end-to-end Holoscan federated analytics application.

The Holoscan Federate Analytics is using [NVIDIA FLARE](https://developer.nvidia.com/flare). NVIDIA FLARE supports federated statistics where FLARE provides built-in federated statistics operators (controller and executors) that can generate global statistics based on local client side statistics.

Refer to the README files in the subfolders for additional information.

- [Holoscan Federated Analytics - Reference application](./applications/holoscan_nvflare_app/README.md)
- [Visualization backend for Holoscan Federated Analytics](./visualization/backend/README.md)
- [Visualization frontend for Holoscan Federated Analytics](./visualization/frontend/README.md)

This project will download and install additional third-party open source software projects. Review the [license terms](./3rdparty/licenses/) of these open source projects before use.