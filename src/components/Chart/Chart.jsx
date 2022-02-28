import CustomTooltip from './CustomTooltip';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import ExpandedChart from './ExpandedChart';
import { useEffect, useState } from 'react';
import { ReactComponent as Fullscreen } from '../../assets/icons/fullscreen.svg';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Typography, Box, SvgIcon, CircularProgress } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { trim } from '../../helpers';
import { format } from 'date-fns';
import './chart.scss';

const formatCurrency = c => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

const tickCount = 3;
const expandedTickCount = 5;

const renderExpandedChartStroke = (isExpanded, color) => {
  return isExpanded ? <CartesianGrid vertical={false} stroke={color} /> : '';
};

const xAxisTickProps = { fontSize: '12px' };
const yAxisTickProps = { fontSize: '12px' };

const renderAreaChart = (
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  isExpanded,
  expandedGraphStrokeColor,
  isPOL,
  domain,
) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[0][1]} stopOpacity={1} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), 'MMM dd')}
      tick={xAxisTickProps}
      reversed={true}
      connectNulls={true}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      tick={yAxisTickProps}
      width={33}
      tickFormatter={number =>
        number !== 0
          ? dataFormat !== 'percent'
            ? `${formatCurrency(parseFloat(number) / 1000000)}M`
            : `${trim(parseFloat(number), 0)}%`
          : ''
      }
      domain={domain}
      dx={3}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          isStaked={isStaked}
          isPOL={isPOL}
        />
      }
    />
    <Area dataKey={dataKey[0]} stroke="none" fill={`url(#color-${dataKey[0]})`} fillOpacity={1} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderStackedAreaChart = (
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
) => (
  <AreaChart data={data}>
    <defs>
      {dataKey.map((key, i) => (
        <linearGradient key={i} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stopColor[i][0]} stopOpacity={1} />
          <stop offset="90%" stopColor={stopColor[i][1]} stopOpacity={1} />
        </linearGradient>
      ))}
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tick={xAxisTickProps}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), 'MMM dd')}
      reversed={true}
      connectNulls={true}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={33}
      tick={yAxisTickProps}
      tickFormatter={number => {
        if (number !== 0) {
          if (dataFormat === 'percent') {
            return `${trim(parseFloat(number), 2)}%`;
          } else if (dataFormat === 'k') return `${formatCurrency(parseFloat(number) / 1000)}k`;
          else return `${formatCurrency(parseFloat(number) / 1000000)}M`;
        }
        return '';
      }}
      domain={[0, 'auto']}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={value => trim(parseFloat(value), 2)}
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    {dataKey.map((key, i) => {
      //Don't fill area for Total (avoid double-counting)
      if (key === 'treasuryMarketValue') {
        return <Area key={i} dataKey={key} />;
      }
      return (
        <Area
          key={i}
          dataKey={key}
          stroke={stroke ? stroke[i] : 'none'}
          fill={`url(#color-${key})`}
          fillOpacity={1}
          stackId="1"
        />
      );
    })}
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderLineChart = (
  data,
  dataKey,
  stroke,
  color,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
  scale,
  domain,
) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tick={xAxisTickProps}
      tickCount={5}
      tickLine={false}
      reversed={true}
      connectNulls={true}
      tickFormatter={str => format(new Date(str * 1000), 'MMM dd')}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={3}
      axisLine={false}
      tick={yAxisTickProps}
      reversed={false}
      tickLine={false}
      width={32}
      scale={scale}
      tickFormatter={number =>
        number !== 0 ? (dataFormat !== 'percent' ? `${number}` : `${trim(parseFloat(number) / 1000, 0)}k`) : ''
      }
      domain={domain}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    {dataKey.map((key, i) => (
      <Line type="monotone" key={i} dataKey={key} stroke={stroke ? stroke : 'none'} color={color} dot={false} />
    ))}

    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

const renderMultiLineChart = (
  data,
  dataKey,
  color,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tick={xAxisTickProps}
      tickCount={3}
      tickLine={false}
      reversed={true}
      connectNulls={true}
      tickFormatter={str => format(new Date(str * 1000), 'MMM dd')}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tick={yAxisTickProps}
      tickLine={false}
      width={33}
      tickFormatter={number =>
        number !== 0 ? (dataFormat !== 'percent' ? `${number}` : `${trim(parseFloat(number) / 1000, 0)}k`) : ''
      }
      domain={[0, 'auto']}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    {dataKey.map((key, i) => (
      <Line dataKey={key} stroke={stroke[i]} dot={false} />
    ))}
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = (
  data,
  dataKey,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
) => (
  <BarChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={tickCount}
      tickLine={false}
      reversed={true}
      tickFormatter={str => format(new Date(str * 1000), 'MMM dd')}
      padding={{ right: 20 }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tickCount={isExpanded ? expandedTickCount : tickCount}
      width={33}
      domain={[0, 'auto']}
      allowDataOverflow={false}
      tickFormatter={number => (number !== 0 ? number : '')}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Bar dataKey={dataKey[0]} fill={stroke[0]} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </BarChart>
);

function Chart({
  type,
  data,
  scale,
  dataKey,
  color,
  stopColor,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  infoTooltipMessage,
  expandedGraphStrokeColor,
  isPOL,
  domain,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type, isExpanded) => {
    if (type === 'line')
      return renderLineChart(
        data,
        dataKey,
        color,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        scale,
        domain,
      );
    if (type === 'area')
      return renderAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isStaked,
        isExpanded,
        expandedGraphStrokeColor,
        isPOL,
        domain,
      );
    if (type === 'stack')
      return renderStackedAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      );
    if (type === 'multi')
      return renderMultiLineChart(
        data,
        dataKey,
        color,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      );

    if (type === 'bar')
      return renderBarChart(
        data,
        dataKey,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      );
  };

  useEffect(() => {
    if (data !== null || undefined) {
      setLoading(false);
    }
  }, [data]);

  return loading ? (
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box style={{ width: '100%', height: '100%', paddingRight: '10px' }}>
      <div className="chart-card-header">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: '100%', overflow: 'hidden' }}
        >
          <Box display="flex" width="90%" alignItems="center" style={{ gap: '5px' }}>
            <Typography
              variant="h6"
              color="secondary"
              className="card-title-text"
              style={{ fontWeight: 700, overflow: 'hidden' }}
            >
              {headerText}
            </Typography>
            <InfoTooltip message={infoTooltipMessage} />
          </Box>
          {/* could make this svgbutton */}

          <SvgIcon
            component={Fullscreen}
            color="primary"
            onClick={handleOpen}
            style={{ fontSize: '1rem', cursor: 'pointer' }}
          />
          <ExpandedChart
            open={open}
            handleClose={handleClose}
            renderChart={renderChart(type, true)}
            uid={dataKey}
            data={data}
            infoTooltipMessage={infoTooltipMessage}
            headerText={headerText}
            headerSubText={headerSubText}
          />
        </Box>
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <Box display="flex">
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
              {headerSubText}
            </Typography>
            <Typography variant="h4" color="secondary" style={{ fontWeight: 500 }}>
              {type !== 'multi' && 'Today'}
            </Typography>
          </Box>
        )}
      </div>
      <Box width="100%" minHeight={260} minWidth={310} className="ohm-chart">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false)}
          </ResponsiveContainer>
        ) : (
          <Skeleton variant="rect" width="100%" height={260} />
        )}
      </Box>
    </Box>
  );
}

export default Chart;
