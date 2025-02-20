# SPDX-FileCopyrightText: Copyright (c) 2025 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
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

import argparse
import os

from nvflare.fuel.flare_api.flare_api import new_secure_session

parser = argparse.ArgumentParser(
    description="Submit a given job to the NVFlare server."
)
parser.add_argument(
    "--folder", type=str, default=".", help="The path to the admin folder."
)
parser.add_argument(
    "--user", type=str, default="holoscan_admin@nvidia.com", help="The user name"
)
args = parser.parse_args()
admin_folder = args.folder
admin_user = args.user
job_name = "holoscan_fl_example"

if not os.path.isabs(admin_folder):
    admin_folder = os.path.abspath(admin_folder)

try:
    print("Creating secure session...")
    sess = new_secure_session(admin_user, admin_folder)

    job_folder = f"{admin_folder}/transfer/{job_name}"
    print(f"Submitting the job `{job_name}`...")
    job_id = sess.submit_job(job_folder)

    print(f"Job is running with ID {job_id}...")

    sess.monitor_job(job_id)
    print("Job done!")
finally:
    sess.close()
