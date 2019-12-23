/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export let processCloudPresetsDefaultModel = {
    'default': [
        {
            'key': 'entry.name',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME',
            'sortable': true
        },
        {
            'key': 'entry.startDate',
            'type': 'date',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE',
            'cssClass': 'hidden',
            'sortable': true,
            'format': 'timeAgo'
        }
    ]
};
