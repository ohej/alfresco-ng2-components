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

import {
    ApiService,
    ApplicationsUtil,
    BrowserActions,
    LoginPage,
    ProcessUtil,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');

describe('Text widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.TEXT;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let appModel;
    let deployedApp, process;
    let processUserModel;

    beforeAll(async () => {
       await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

       processUserModel = await usersActions.createUser();

       await apiService.getInstance().login(processUserModel.email, processUserModel.password);
       appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

       const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
       deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
       process = await new ProcessUtil(apiService).startProcessByDefinitionName(appModel.name, app.processName);
       await loginPage.login(processUserModel.email, processUserModel.password);
   });

    beforeEach(async () => {
        const urlToNavigateTo = `${browser.baseUrl}/activiti/apps/${deployedApp.id}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
   });

    it('[C268157] Should be able to set general properties for Text widget', async () => {
        const label = await widget.textWidget().getFieldLabel(app.FIELD.simpleText);
        await expect(label).toBe('textSimple*');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        const placeHolder = await widget.textWidget().getFieldPlaceHolder(app.FIELD.simpleText);
        await expect(placeHolder).toBe('Type something...');
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C268170] Min-max length properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMinMax, 'A');
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toContain('Enter at least 4 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.textWidget().setValue(app.FIELD.textMinMax, 'AAAAAAAAAAA');
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toContain('Enter no more than 10 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
    });

    it('[C268171] Input mask reversed checkbox properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMask, '18951523');
        await expect(await widget.textWidget().getFieldValue(app.FIELD.textMask)).toBe('1895-1523');
    });

    it('[C268171] Input mask reversed checkbox properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMaskReversed, '1234567899');
        await expect(await widget.textWidget().getFieldValue(app.FIELD.textMaskReversed)).toBe('3456-7899');
    });

    it('[C268177] Should be able to set Regex Pattern property for Text widget', async () => {
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await widget.textWidget().setValue(app.FIELD.textRegexp, 'T');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textRegexp)).toContain('Enter a different value');
        await widget.textWidget().setValue(app.FIELD.textRegexp, 'TE');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C274712] Should be able to set visibility properties for Text widget ', async () => {
        await widget.textWidget().isWidgetNotVisible(app.FIELD.textHidden);
        await widget.textWidget().setValue(app.FIELD.showHiddenText, '1');
        await widget.textWidget().isWidgetVisible(app.FIELD.textHidden);
    });
});
