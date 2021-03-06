/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useCallback, useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { NativeFiltersForm, NativeFiltersFormItem } from '../types';
import { setNativeFilterFieldValues, useForceUpdate } from './utils';
import { Filter } from '../../types';

// When some fields in form changed we need re-fetch data for Filter defaultValue
// eslint-disable-next-line import/prefer-default-export
export const useBackendFormUpdate = (
  form: FormInstance<NativeFiltersForm>,
  filterId: string,
) => {
  const forceUpdate = useForceUpdate();
  const formFilter = (form.getFieldValue('filters') || {})[filterId];
  useEffect(() => {
    setNativeFilterFieldValues(form, filterId, {
      isDataDirty: true,
      defaultValueQueriesData: null,
    });
    forceUpdate();
  }, [
    form,
    formFilter?.filterType,
    formFilter?.column,
    formFilter?.dataset?.value,
    JSON.stringify(formFilter?.adhoc_filters),
    formFilter?.time_range,
    forceUpdate,
    filterId,
  ]);
};

export const useDefaultValue = (
  formFilter?: NativeFiltersFormItem,
  filterToEdit?: Filter,
) => {
  const [hasDefaultValue, setHasPartialDefaultValue] = useState(
    !!filterToEdit?.defaultDataMask?.filterState?.value ||
      formFilter?.controlValues?.enableEmptyFilter,
  );
  const setHasDefaultValue = useCallback(
    (value?) => {
      setHasPartialDefaultValue(
        value || formFilter?.controlValues?.enableEmptyFilter
          ? true
          : undefined,
      );
    },
    [formFilter?.controlValues?.enableEmptyFilter],
  );

  useEffect(() => {
    setHasDefaultValue();
  }, [setHasDefaultValue]);

  return [hasDefaultValue, setHasDefaultValue];
};
