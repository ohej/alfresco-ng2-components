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

import { Injectable } from '@angular/core';
import { FormRenderingService } from '@alfresco/adf-core';
import { AttachFileWidgetComponent } from '../content-widget/attach-file-widget.component';
import { AttachFolderWidgetComponent } from '../content-widget/attach-folder-widget.component';

@Injectable({
    providedIn: 'root'
})
export class ProcessFormRenderingService extends FormRenderingService {
    constructor() {
        super();
        this.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
        this.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
    }
}