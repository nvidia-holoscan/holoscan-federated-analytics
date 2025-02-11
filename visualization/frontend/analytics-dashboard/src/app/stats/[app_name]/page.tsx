/*!
 * SPDX-FileCopyrightText: Copyright (c) 2025 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
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
'use client';
import { useCallback, useState, useEffect } from "react";
import { Table, TableRow, TableHeader, TableDataCell } from '@kui-react/table'
import { Text } from "@kui-react/text";
import { AppNames } from "../../../../src/config";
import { Flex } from '@kui-react/flex'
import { Select, SelectItem, SelectOption } from "@kui-react/select";
import { DatepickerRange, DatepickerTrigger} from "@kui-react/datepicker";
import { DateRange } from "react-day-picker";
import { format} from 'date-fns'
import { TextInput } from "@kui-react/text-input";
import { Checkbox } from '@kui-react/checkbox'
import { Label } from '@kui-react/label'
import dynamic from "next/dynamic";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ThemeProvider = dynamic(
  () => import("@kui-react/theme").then((m) => m.ThemeProvider),
  {
    ssr: false,
  }
);

const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const DD = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const SS = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${DD}_${HH}${mm}${SS}`;
};

const formatDateString = (dateString: string): string => {
      // Regular expression to validate and capture components
      const regex = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})$/;
      const match = dateString.match(regex);
  
      if (!match) {
          throw new Error("Input date format should be YYYYMMDD_HHMMSS",);
      }
  
      // Extract components using capturing groups
      const year = match[1];
      const month = match[2];
      const day = match[3];
      const hour = match[4];
      const minute = match[5];
      const second = match[6];
  
      // Construct and return the formatted string
      return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

type HistogramBucket = [number, number, number];

interface HoloscanSet<T> {
  [key: string]: T | HistogramBucket[]; // Allow any key with a base type or a histogram array
}

interface GlobalMetrics {
  count: {
    holoscan_set: HoloscanSet<number>;
  };
  failure_count: {
    holoscan_set: HoloscanSet<number>;
  };
  sum: {
    holoscan_set: HoloscanSet<number>;
  };
  mean: {
    holoscan_set: HoloscanSet<number>;
  };
  min: {
    holoscan_set: HoloscanSet<number>;
  };
  max: {
    holoscan_set: HoloscanSet<number>;
  };
  histogram: {
    holoscan_set: HoloscanSet<HistogramBucket[]>;
  };
  var: {
    holoscan_set: HoloscanSet<number>;
  };
  stddev: {
    holoscan_set: HoloscanSet<number>;
  };  
}

export type DynamicData<T = unknown> = {
  [key: string]: T | DynamicData<T> | Array<T>;
};

export type RootData = DynamicData<GlobalMetrics>;

function extractHierarchy(data: RootData): RootData {
  if (Array.isArray(data)) {
    return JSON.parse(JSON.stringify(data.map(extractHierarchy)));
  } else if (typeof data === 'object' && data !== null) {
    const result: RootData = { Name: data.Name };
    for (const key in data) {
      if (Array.isArray(data[key])) {
        // Recursive call for nested structure
        result[key] = extractHierarchy(JSON.parse(JSON.stringify(data[key])));
      }
    }
    return result;
  }
  return data;
}

const StatsPage = ({ params }: { params: { app_name: string } }) => {
  const [renderCurrentLevcelStatistics, setRenderCurrentLevcelStatistics] = useState<boolean>(false);
  const [globalData, setGlobalData] = useState<GlobalMetrics | null>(null);
  const [localData, setLocalData] = useState<RootData | null>(null)
  const [hierarchy, setHierarchy] = useState<GenericObject | null>(null)
  const [statsList, setStatsList] = useState<string[] | null>(null);
  const [columns, setColumns] = useState<string[] | null>(null);
  const [features, setFeatures] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined, // can be undefined if not preferred to start from today
    to: undefined,
  }) 
  const [expand, setExpand] = useState<boolean | undefined>(true)
  const [selectedDate, setSelectedDate] = useState<string>("Latest Statistics")
  const [selectedStatsType, setSelectedStatsType] = useState<string>("global");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  
  type GenericObject = {
    [key: string]: unknown;
  };

  const isValueAtFinalLevel = (data: unknown, targetValue: unknown): boolean => {
    /**
     * Determines if the targetValue exists at the final level of the hierarchy.
     *
     * @param data - The hierarchical data to search through.
     * @param targetValue - The value to find in the hierarchy.
     * @returns True if the value is at the final level, False otherwise.
     */
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        // Search each item in the array
        for (const item of data) {
          if (isValueAtFinalLevel(item, targetValue)) {
            return true;
          }
        }
      } else {
        // Search each key-value pair in the object
        for (const [, value] of Object.entries(data)) {
          if (value === targetValue) {
            // Check if this key has no nested structures
            return Object.values(data).every(v => typeof v !== "object" || v === null);
          } else if (typeof value === "object" && value !== null) {
            // Recursively search nested objects
            if (isValueAtFinalLevel(value, targetValue)) {
              return true;
            }
          }
        }
      }
    }
    return false; // Return false if the value is not found or is not at the final level
  }
  


  const handleSelectionChange = (level: number, value: string) => {
    // Update the array of selected values
    const newSelectedValues = [...selectedValues];
    newSelectedValues[level] = value;
    // Reset all subsequent selections
    newSelectedValues.length = level + 1;
    setSelectedValues(newSelectedValues);
    if (value === 'Show Global Statistics' || isValueAtFinalLevel(hierarchy, value)) {
      setRenderCurrentLevcelStatistics(true);
    } else {
      setRenderCurrentLevcelStatistics(false);
    }
  };

  const renderSelectBoxes = (
    data: GenericObject[],
    level: number,
    title: string = ''
  ): JSX.Element | null => {
    if (!data || data.length === 0) {
      return null;
    }

    const currentSelectedValue = selectedValues[level] || '';    
    let options = data.map(item => item.Name);

    // Determine subData for the next level
    const selectedItem = data.find(item => item.Name === currentSelectedValue);
    let subData: GenericObject[] = [];
    let subTitle: string = ''
    if (selectedItem) {
      const keys = Object.keys(selectedItem).filter(key => key !== 'Name');
      if (keys.length > 0 && Array.isArray(selectedItem[keys[0]])) {
        subTitle = keys[0];
        subData = JSON.parse(JSON.stringify(selectedItem[keys[0]]));
      }
    }
    if (!isValueAtFinalLevel(hierarchy, options[0])) {
      options = [...options, 'Show Global Statistics']
    }
    return (
      <>
        <Select 
                defaultValue={currentSelectedValue}
                onChange={(value) => handleSelectionChange(level, value)}
		            options={JSON.parse(JSON.stringify(options.map((str => ({
                  'label': str,
                  'value': str
                })))))}
                renderItem={(item: SelectOption, index: number) => (
                  <SelectItem
                    key={index}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                )}
                label={`Select ${title}`}
                css={{marginLeft: 50, width: 200}}
              />
        {subData.length > 0 && renderSelectBoxes(subData, level + 1, subTitle)}
      </>
    );
  };

  
  const handleDateChange = (value: string) => {
    setSelectedDate(value); // Access the selected value
    setDateRange(undefined);
    if (value == "Latest Statistics" && selectedDate != "Latest Statistics") {
      fetchStats();
    } else {      
      fetchStats(value);
    }
  };

  const handleStatsTypeChange = (value: string) => {
    setSelectedStatsType(value); // Access the selected value
    setDateRange(undefined);
    setSelectedValues([]);
  };

  const handleOnDayClick = (range: DateRange) => {
     if(range.to && range.from) {
       setDateRange(range);
       fetchStats(range)
     }
  }

  const onExpand = () => {
     setExpand(!expand) ;
  }

  let dateString = ''
  if (dateRange?.from && dateRange.to) {
    dateString = `${format(new Date(dateRange.from), 'P')}-${format(
      new Date(dateRange.to),
      'P'
    )}`
  }

  // Fetch data from visualization backend API using useEffect
  const fetchStats = useCallback((date: string | DateRange | undefined = undefined) => {
    (async () => {
      try {
        const authorizationHeader = `Bearer ${process.env.NEXT_PUBLIC_AUTHPORIZATION_HEADER}`;
        let request_uri = `${process.env.NEXT_PUBLIC_ROOT_URI}/get_stats/${params.app_name}`;
        if(date && typeof(date) === 'string') {
          request_uri = `${request_uri}/?timestamp=${date}`;
        } else if (date && (date as DateRange)?.to && (date as DateRange)?.from) {
          const fr = (date as DateRange)?.from;
          const to = (date as DateRange)?.to;
          if (fr && to) {
            request_uri = `${process.env.NEXT_PUBLIC_ROOT_URI}/get_range_stats/${params.app_name}/${formatDate(fr)}/${formatDate(to)}/`;
          }
        }
        const res = await fetch(request_uri, {
            method: 'GET',
            headers: {
                'Authorization': `${authorizationHeader}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
          throw new Error(`An error occurred while fetching the stats for the given apps: ${res.statusText}`);
        }
        const result = await res.json();
        if (Object.keys(result).length > 0) {
          setGlobalData(result.Global);  // Store data in state
          setColumns(['Feature / Metric', ...Object.keys(result.Global)]);
          setFeatures(Object.keys(result.Global[Object.keys(result.Global)[0]]?.holoscan_set));

          // Get the JSON data without high level global stats and calculate hierarchy
          const entries = Object.entries(result);
          const [, ...restEntries] = entries;
          const hierarchyData = extractHierarchy(JSON.parse(JSON.stringify(Object.fromEntries(restEntries))));
          const root: RootData = JSON.parse(JSON.stringify(Object.fromEntries(restEntries)));
          setLocalData(root);
          setHierarchy(hierarchyData);
        } else {
          setDateRange(undefined);
        }

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError((err as Error).message);  // Store error in state
        }
      }
    })();
  }, [params.app_name]);
    
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

    // Fetch data from visualization backend API using useEffect
    const fetchStatsList = useCallback(() => {
      (async () => {
        try {
          const authorizationHeader = `Bearer ${process.env.NEXT_PUBLIC_AUTHPORIZATION_HEADER}`;
          const res = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URI}/get_stats_list/${params.app_name}`, {
              method: 'GET',
              headers: {
                  'Authorization': `${authorizationHeader}`,
                  'Content-Type': 'application/json'
              }
          });
          if (!res.ok) {
            throw new Error(`An error occurred while fetching the stats for the given apps: ${res.statusText}`);
          }
          const result = await res.json();
          setStatsList([selectedDate, ...result]);  // Store data in state
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError((err as Error).message);  // Store error in state
          }
        }
      })();
    }, [params.app_name, selectedDate]);
  
  useEffect(() => {
      fetchStatsList();
    }, [fetchStatsList]);
  
  // Display loading, error or data
  return (
    <ThemeProvider theme="light" withFonts withReset>
    <div>
      {error && <p>Error: {error}</p>}
      {!globalData && !error && <p>Loading...</p>}
      {globalData && (
        <div style={{width: '100%', textAlign: 'center'}}>
          <Text variant="h1">{AppNames.get(params.app_name)}</Text>
          <Flex css={{margin: 50}}>
            <Select
              defaultValue={"global"}
              onChange={handleStatsTypeChange}
              options={[
                {
                  label: 'Global Statistics',
                  value: 'global'
                },
                {
                  label: 'Hierarchical Statistics',
                  value: 'local'
                }
              ]}
              renderItem={(item: SelectOption, index: number) => (
                <SelectItem
                  key={index}
                  value={item.value}
                >
                  {item.label}
                </SelectItem>
              )}
              label="Statistics Type"
              css={{width: 200}}
            />
            {/* Render available stats list */}
            {statsList && (
              <Select 
                defaultValue={"Latest Statistics"}
                onChange={handleDateChange}
                options={statsList.sort().map((str => ({
                  'label': str === "Latest Statistics" ? str: formatDateString(str),
                  'value': str
                })))
              }
                renderItem={(item: SelectOption, index: number) => (
                  <SelectItem
                    key={index}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                )}
                label="Select Stats"
                css={{marginLeft: 50, width: 200}}
              />
            )}
            {/* Render date range selector */}
            <DatepickerRange
              popoverRootProps={{ defaultOpen: false }}
              selected={dateRange}
              onDayClick={handleOnDayClick}              
              numberOfMonths={2}
            >
              <div style={{ maxWidth: '250px', marginTop: 4, marginLeft: 50 }}>
                <TextInput
                  label="Select date range"
                  value={dateString}
                  readOnly
                  slotRight={<DatepickerTrigger />}
                />
              </div>
            </DatepickerRange>
            {/* Render expand checkbox */}
            <Flex
              align="center"
              gap="sm"
              css={{marginLeft: 50}}
            >
              <Label htmlFor="expand">Visualize</Label>
              <Checkbox
                checked={expand}
                id="expand"
                name="expand"
                value="expand"
                onChange={onExpand}
              />
            </Flex>
            </Flex>
            {/* Render global statistics */}
            {selectedStatsType === "global" && 
            <div style={{marginTop: -50, marginLeft: 50}}>
              <Table css={{width: '80%'}}>
                <thead>
                  <TableRow selected css={{backgroundColor: '#76b900' }}>
                    {columns?.map(header => (
                      <TableHeader key={header}>
                        {header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </thead>
                <tbody>
                  {features?.map(featureRow => (
                      <>                    
                      <TableRow selected css={{width: '100%'}}>
                          <TableHeader>
                            {featureRow}
                          </TableHeader>
                        </TableRow>
                        <TableRow css={{backgroundColor: '#F6FFEB'}}>
                          {columns?.map((col: string,) => (                            
                              <TableDataCell key={col}>
                                {JSON.stringify(globalData[col as keyof GlobalMetrics]?.holoscan_set[featureRow])}
                              </TableDataCell>                          
                          ))}                          
                        </TableRow>
                        {expand && (
                          <TableRow css={{alignText: 'center'}}>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            {(() => {
                                  const hist = globalData["histogram"].holoscan_set[featureRow]
                                  const histogramData = hist.map(([start, end, count]) => ({
                                    range: `${start} - ${end}`,
                                    count,
                                  }));              
                                  return (
                                    <ResponsiveContainer width="80%" height={200}>
                                      <BarChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}  data={histogramData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis style={{marginBottom:10}} dataKey="range" label={{ value: "Range", position: "insideBottom", offset: -5 }} />
                                        <YAxis label={{ value: "Count", angle: -90, position: "insideLeft", offset: -5 }} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#76b900" barSize={30}/>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  );
                              })()}
                          </TableRow>                          
                        )}
                        </>         
                  ))}
                </tbody>
              </Table>
            </div>}
            {/* Render local statistics */}
            {selectedStatsType === "local" && hierarchy &&
              <>
              <Flex css={{marginTop: -50}}>
                {renderSelectBoxes(JSON.parse(JSON.stringify(hierarchy[Object.keys(hierarchy)[1]])), 0, Object.keys(hierarchy)[1])}
              </Flex><Flex>
                {(() => {
                  let index = 0;
                  let dataTree = localData;
                  const len = selectedValues.length;
                  while (index <= len - 1 && selectedValues[index] != 'Show Global Statistics') {
                    if (dataTree) {
                      // @ts-expect-error TODO: Fix this
                      dataTree = dataTree[Object.keys(dataTree)[0]].find((child: {[key: string]: string}) => child.Name === selectedValues[index]);
                      if (dataTree) {
                        const entries = Object.entries(dataTree);
                        const [, ...restEntries] = entries;
                        dataTree = Object.fromEntries(restEntries);
                      }
                      index++;
                    }
                  }
                  let tempData: GlobalMetrics = globalData;                  
                  if (dataTree && dataTree.Global) {
                    // @ts-expect-error TODO: Fix this
                    tempData = dataTree.Global;
                  } else if (dataTree && dataTree.Local) {
                    // @ts-expect-error TODO: Fix this
                    tempData = dataTree.Local;
                  }
                  if (renderCurrentLevcelStatistics) {
                    return (
                    <div>
                    <Table css={{width: '100%', marginLeft: 50}}>
                      <thead>
                        <TableRow selected css={{backgroundColor: '#76b900' }}>
                          {columns?.map(header => (
                            <TableHeader key={header}>
                              {header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </thead>
                      <tbody>
                        {features?.map(featureRow => (
                          <>
                            <TableRow selected css={{width: '100%'}}>
                                <TableHeader>
                                  {featureRow}
                                </TableHeader>
                              </TableRow>
                              <TableRow css={{backgroundColor: '#F6FFEB'}}>
                                {columns?.map((col: string, ) => (                            
                                    <TableDataCell key={col}>
                                      {JSON.stringify(tempData[col as keyof GlobalMetrics]?.holoscan_set[featureRow])}
                                    </TableDataCell>                          
                                ))}
                              </TableRow>
                              {expand && (
                          <TableRow css={{alignText: 'center'}}>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            <TableDataCell></TableDataCell>
                            {(() => {
                                  const hist = tempData["histogram"].holoscan_set[featureRow]
                                  const histogramData = hist.map(([start, end, count]) => ({
                                    range: `${start} - ${end}`,
                                    count,
                                  }));              
                                  return (
                                    <ResponsiveContainer width="80%" height={200}>
                                      <BarChart margin={{ top: 20, right: 30, left: 30, bottom: 20}} data={histogramData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="range" label={{ value: "Range", position: "insideBottom", offset: -5 }} />
                                        <YAxis label={{ value: "Count", angle: -90, position: "insideLeft", offset: -5 }} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#76b900" barSize={30}/>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  );
                              })()}
                          </TableRow>
                        )}
                          </>
                        ))}
                        </tbody>
                    </Table>
                    </div>
                  )    
                  }
                  return <></>
                })()}
              </Flex>
              </>
            }
        </div>
      )}
    </div>
    </ThemeProvider>
  );
    
}

export default StatsPage;
