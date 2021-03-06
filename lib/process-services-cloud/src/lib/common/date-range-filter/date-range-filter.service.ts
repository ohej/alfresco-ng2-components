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
import moment from 'moment-es6';
import { DateRangeFilter, DateCloudFilterType } from '../../models/date-cloud-filter.model';

@Injectable({
    providedIn: 'root'
})
export class DateRangeFilterService {

    currentDate = new Date();

    getDateRange(type: DateCloudFilterType): DateRangeFilter {
        switch (type) {
            case DateCloudFilterType.TODAY: return this.getTodayDateRange();
            case DateCloudFilterType.TOMORROW: return this.getTomorrowDateRange();
            case DateCloudFilterType.NEXT_7_DAYS: return this.getNext7DaysDateRange();
            case DateCloudFilterType.WEEK: return this.getCurrentWeekRange();
            case DateCloudFilterType.MONTH: return this.getCurrentMonthDateRange();
            case DateCloudFilterType.QUARTER: return this.getQuarterDateRange();
            case DateCloudFilterType.YEAR: return this.getCurrentYearDateRange();
            case DateCloudFilterType.RANGE: return this.resetDateRange();
            case DateCloudFilterType.NO_DATE: return this.resetDateRange();
            default: throw new Error('ADF_CLOUD_EDIT_PROCESS_FILTER.ERROR.INVALID_DATE_FILTER');
        }
    }

    private resetDateRange(): DateRangeFilter {
        return {
            startDate: null,
            endDate: null
        };
    }

    private getNext7DaysDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().add(7, 'days').endOf('day').toDate()
        };
    }

    private getTomorrowDateRange(): DateRangeFilter {
        return {
            startDate: moment().endOf('day').toDate(),
            endDate: moment().add(1, 'days').startOf('day').toDate()
        };
    }

    private getCurrentYearDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate()
        };
    }

    private getTodayDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().endOf('day').toDate()
        };
    }

    private getCurrentWeekRange(): DateRangeFilter {
        return  {
            startDate: moment().startOf('week').toDate(),
            endDate: moment().endOf('week').toDate()
        };
    }

    private getCurrentMonthDateRange(): DateRangeFilter {
        return {
            startDate: moment().startOf('month').toDate(),
            endDate: moment().endOf('month').toDate()
        };
    }

    private getQuarterDateRange(): DateRangeFilter {
        const quarter = Math.floor((this.currentDate.getMonth() / 3));
        const firstDate = new Date(this.currentDate.getFullYear(), quarter * 3, 1);
        return {
            startDate: firstDate,
            endDate: new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0)
        };
    }
}
