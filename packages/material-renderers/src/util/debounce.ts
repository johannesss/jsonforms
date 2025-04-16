/*
  The MIT License

  Copyright (c) 2021 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import debounce from 'lodash/debounce';
import { useState, useCallback, useEffect } from 'react';

const defaultEventToValue = (ev: any) => ev.target.value;
interface DebouncedChangeParams {
  handleChange: (path: string, value: any) => void;
  data: any;
  path: string;
  eventToValue?: (ev: any) => any;
  defaultValue?: any;
  flushOnBlur?: boolean;
  focused?: boolean;
  timeout?: number;
}
export const useDebouncedChange = ({
  handleChange,
  data,
  path,
  eventToValue = defaultEventToValue,
  defaultValue = '',
  flushOnBlur = false,
  focused = false,
  timeout = 300,
}: DebouncedChangeParams): [any, React.ChangeEventHandler, () => void] => {
  const [input, setInput] = useState(data ?? defaultValue);
  useEffect(() => {
    setInput(data ?? defaultValue);
  }, [data]);
  const debouncedUpdate = useCallback(
    debounce((newValue: string) => handleChange(path, newValue), timeout),
    [handleChange, path, timeout]
  );
  useEffect(() => {
    if (!focused && flushOnBlur) {
      debouncedUpdate.flush();
    }
  }, [focused, flushOnBlur, debouncedUpdate]);
  const onChange = useCallback(
    (ev: any) => {
      const newValue = eventToValue(ev);
      setInput(newValue ?? defaultValue);
      debouncedUpdate(newValue);
    },
    [debouncedUpdate, eventToValue]
  );
  const onClear = useCallback(() => {
    setInput(defaultValue);
    handleChange(path, undefined);
  }, [defaultValue, handleChange, path]);
  return [input, onChange, onClear];
};
