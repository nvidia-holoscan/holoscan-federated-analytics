# Holoscan Federated Analytics - Reference application

This folder contains a complete packaged reference application for the Holoscan federated analytics using NVIDIA FLARE.


## NVFLARE for Federated Statistics

[NVIDIA FLARE](https://developer.nvidia.com/flare) (NVIDIA Federated Learning Application Runtime Environment) is a robust framework designed to facilitate federated learning and federated statistics. It allows multiple institutions to collaboratively compute statistical measures on distributed datasets without centralizing the data. This approach ensures data privacy and security while enabling the generation of aggregated statistical insights.


### Key Components of NVFLARE involved in Federated Statistics


#### Server
The server is the central coordinating entity in the federated statistics workflow.


##### NVFLARE Admin Server
It manages control operations, such as starting, stopping, and monitoring the federated statistics process.


##### NVFLARE App Server
It orchestrates the aggregation of statistical results from multiple clients, ensuring that global statistical measures are computed correctly.


#### NVFLARE Client
Clients are the participants that perform local statistical computations on their datasets.

Local Statistician: The component responsible for calculating local statistical measures such as mean, variance, and standard deviation on the client’s dataset.

Communicator: Handles the communication between the client and the server, including sending local statistical results to the server and receiving aggregated statistics.


#### Federated Statistics Workflow
The workflow defines the process and sequence of tasks for federated statistics computation.

Statistics Workflow: Specifies the steps involved in computing and aggregating statistics, including local computation and aggregation tasks.

Task Definitions: Detailed definitions of specific tasks, such as computing local statistics and aggregating results, which are executed during the workflow.


#### Configuration Files
Configuration files define the settings and parameters for the federated statistics application.

Server Configuration: Contains settings related to the server’s role, such as aggregation methods and communication protocols.

Client Configuration: Specifies parameters for the client’s local computations, including the statistical measures to compute.

Workflow Configuration: Describes the sequence of tasks in the federated statistics workflow and their respective parameters.


### Example Workflow in Federated Statistics
1. Initialization: Clients and server initialize the federated learning environment.
2. Local Computation: Each client computes local statistical measures (e.g., count, mean, variance) on its own data.
3. Communication: Clients send their local statistics to the server.
4. Aggregation: The server aggregates the local statistics into global statistics.
5. Distribution: The server sends the aggregated statistics back to the clients.
6. Evaluation: Clients may perform local evaluation of the aggregated statistics.


### Summary
NVFLARE in the context of federated statistics provides a comprehensive framework for securely and collaboratively computing statistical measures across distributed datasets. By leveraging its key components—server, client, federated statistics workflow, configuration files, data management, security and privacy, logging and monitoring, and extensibility—NVFLARE ensures a robust, secure, and flexible platform for federated statistics applications.


## Holoscan Federated Analytics using NVFLARE
NVIDIA Holoscan is the AI sensor processing platform that combines hardware systems for low-latency sensor and network connectivity, optimized libraries for data processing and AI, and core microservices to run streaming, imaging, and other applications, from embedded to edge to cloud. It can be used to build streaming AI pipelines for a variety of domains, including Medical Devices, High Performance Computing at the Edge, and Industrial Inspection.

NVIDIA Holoscan is normally deployed on a fleet of IGX devices. A goal here is to provide Holoscan customers a feature where Holoscan customers can capture and analyze specific metrics for Holoscan applications deployed on a fleet of IGX devices. This should be demonstrated with a sample end-to-end Holoscan federated analytics application.

There are three main tasks involved here:
- Data Collection
- Data Processing and
- Data Analytics.

Data collection is separately handled by Holoscan whereas NVFLARE is used for Data Processing and Data Analytics.


### Key Components of Holoscan Federated Analytics reference application


#### Holoscan Reference Application
The holoscan application acts as the data generator. It needs to generate the data required for analytics. HSDK has the Data Exporter API that can be used to generate Holoscan application output in NVFLARE compatible format.

The `Endoscopy Out of Body Detection` application is modified to support analytics. This application is used as the reference data generator application for Holoscan Federated Analytics. When the `enable_analytics` flag in the application configuration file is set to `true`, it generates the application output as a CSV file. This output can then be passed as the input for the NVFLARE application.


#### NVFLARE Application for Holoscan Federated Analytics

This is the NVFLARE application for generating global statistics using the data generated by each configured Holoscan application instance as input.

It mainly consists of:
- Client configuration that specifies the script details to generate local statistics and other related parameters.
- Server configuration that specifies the metrics that need to be calculated, scripts that aggregate the local statistics and the other related parameters.
- All the custom scripts. This application supports hierarchical statistics. A json file defining the hierarchy can be provided and the file name needs to be specified in the server configuration file. The global statistics output generated by the NVFLARE will have global statistics as well as the aggregated statistics at each hierarchical level.


##### Packaging and Deployment
The application is currently configured to have two NVFlare clients named `Holoscan-Device-1` and `Holoscan-Device-2` and the NVFlare Server named `holoscan.nvflare.sever`. The admin user is configured as `holoscan_admin@nvidia.com`.

NVFLARE provisioning tool is used to create the startup kits for server, clients and admin. If more NVFLARE clients are required to be added, NVFLARE provisioning tool can be used to add it to the existing configuration.

A script `dev_container` is provided to build a NVFLARE docker image and run server/client/admin containers.


##  Building and running the application
Generating the global statistics consists of building and running the Holoscan reference application first to generate the data and then running the NVFLARE application.


### Building and running the Holoscan reference application

```bash
    # 1. Clone Holohub source.

    git clone git@github.com:nvidia-holoscan/holohub.git
    cd holohub

    # 2. Create a directory to store the Holoscan application generated output, this will later be used as input to the NVFLARE application.
    # Example directory:
    mkdir /media/m2/holoscan_data

    # Build Holohub dev container
    ./dev_container build

    # 3. Launch dev container. While launching we also need to mount the earlier created directory to persist the generated Holoscan application output.
    ./dev_container launch --docker_opts "-v /media/m2/holoscan_data:/workspace/holoscan_data"

    # 4. Set the `HOLOSCAN_ANALYTICS_DATA_DIRECTORY` to `/workspace/holoscan_data`
    export HOLOSCAN_ANALYTICS_DATA_DIRECTORY=/workspace/holoscan_data

    # 5. Build endoscopy out of body detection application.
    ./run build endoscopy_out_of_body_detection

    # 6. Enable analytics data generation by setting `enable_analytics` flag in the config file <build_dir>/applications/endoscopy_out_of_body_detection/endoscopy_out_of_body_detection.yaml to `true`.

    # 7. Run endoscopy out of body detection application.
    ./run launch endoscopy_out_of_body_detection
    # (This may take some time, output will be in a CSV file instead of printing it on the screen.)

    # The holohub container can be exited now as the data generation is done.
```


### Building and running the Holoscan Federated Analytics NVFLARE reference application


#### Building and running on the single host

Follow below steps to build and run all the Server, clients and admin containers on the same machine.

```bash
    cd <root>

    # 1. Build NVFLARE dev container
    ./dev_container build

    # 2. Edit `/etc/hosts` to map NVFLARE server name to holoscan.nvflare.sever, add below entry to `/etc/hosts`
    <machine IP>   holoscan.nvflare.server

    # 3. Create a directory to store NVFLARE output, below is one example path
    mkdir /media/m2/output/

    # 4. Run NVFLARE server container in first terminal as below
    ./dev_container run --server holoscan.nvflare.server --data /media/m2/output/

    # 5. Once inside the container, start the NVFLARE server
    ./start.sh

    # 6. Open another terminal and run the first NVFLARE client container, specify directory from where to read the input (output of Holoscan app)
    ./dev_container run --client Holoscan-Device-1 --data /media/m2/holoscan_data

    # 7. Once inside the container, start the first NVFLARE client
    ./start.sh

    # 8. Open another terminal and run the second NVFLARE client container, specify directory from where to read the input (output of Holoscan app)
    ./dev_container run --client Holoscan-Device-2 --data /media/m2/holoscan_data

    # 9. Once inside the container, start the second NVFLARE client
    ./start.sh

    # 10. Start admin container
    ./dev_container run --admin holoscan_admin@nvidia.com

    # 11. Once inside the admin container, submit the Holoscan federated analytics job to get global statistics.
    python3 ./submit_job.py .

    # Once the job is finished, all the containers can be exited.
    # The global statistics output will be available in the specified output directory (`/media/m2/output/`).
    # On each run, the directory with the current timestamp will be created and global statistics JSON file will be created inside it.

```


#### Building and running on the distributed setup

In the real world, Holoscan applications will be running on the fleet of IGX devices and generating the federated statistics will be about getting the local statistics from each IGX device and then aggregating it to calculate the overall statistics.

This reference application can be run on distributed setup.

Below is the sample configuration and steps to run the end-to-end application.

- IGX 1:
-- Holoscan Applications Instance 1
-- NVFLARE Server
-- NVFLARE Client 1
-- NVFLARE Admin

- IGX 2:
-- Holoscan Applications Instance 2
-- NVFLARE Client 2

Follow below steps to run the distributed application:

```bash
    # Steps to be followed on IGX 1

    # 1. Follow steps mentioned earlier to get, build and run the endoscopy out of body detection application.
    #    Additionally `count` parameter in `analytics_replayer` section in the application config can be
    #    modified to differentiate the output of applications running on different devices.

    # 2. Build NVFLARE dev container
    ./dev_container build

    # 3. Edit `/etc/hosts` to map NVFLARE server name to holoscan.nvflare.sever, add below entry to `/etc/hosts`
    <IGX1 IP>   holoscan.nvflare.server

    # 3. Create a directory to store NVFLARE output, below is one example path
    mkdir /media/m2/output/

    # 4. Run NVFLARE server container in first terminal as below
    ./dev_container run --server holoscan.nvflare.server --data /media/m2/output/

    # 5. Once inside the container, start the NVFLARE server
    ./start.sh

    # 6. Open another terminal and run the first NVFLARE client container, specify directory from where to read the input (output of Holoscan app)
    ./dev_container run --client Holoscan-Device-1 --data /media/m2/holoscan_data

    # 7. Once inside the container, start the first NVFLARE client
    ./start.sh

    # 10. Start admin container
    ./dev_container run --admin holoscan_admin@nvidia.com


    # Steps to be followed on IGX 2

    # 1. Follow steps mentioned earlier to get, build and run the endoscopy out of body detection application.
    #    Additionally `count` parameter in `analytics_replayer` section in the application config can be
    #    modified to differentiate the output of applications running on different devices.

    # 2. Build NVFLARE dev container
    ./dev_container build

    # 3. Edit `/etc/hosts` to map NVFLARE server name to holoscan.nvflare.sever, add below entry to `/etc/hosts`
    # Note: NVFLARE server is now running on IGX 1, so the IP of IGX 1 should be used here for the mapping.
    <IGX1 IP>   holoscan.nvflare.server

    # Run the second NVFLARE client container, specify directory from where to read the input (output of Holoscan app)
    # Note: Server, first client and admin are running on IGX 1
    ./dev_container run --client Holoscan-Device-1 --data /media/m2/holoscan_data

    # 7. Once inside the container, start the second NVFLARE client
    ./start.sh

    # Once the client 2 is started, switch back to IGX 1 again and follow the below steps.


    # Steps to be followed on IGX 1

    # 1. Switch to the admin container terminal and submit the Holoscan federated analytics job inside the admin container to get the global statistics.
    python3 ./submit_job.py .

    # Once the job is finished, all the containers can be exited.
    # The global statistics output will be available in the specified output directory (`/media/m2/output/`) on IGX 1 as the server is running on IGX 1.
    # On each run, the directory with the current timestamp will be created and a global statistics JSON file will be created inside it.
```

Similarly, other distributed configurations can be tried out, for example - running both the clients on IGX 1 and running NVFLARE Server and Admin on IGX 2.
