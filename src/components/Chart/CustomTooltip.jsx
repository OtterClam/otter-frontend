import { Paper, Box, Typography } from '@material-ui/core';
import { trim, localeString } from '../../helpers';
import './customtooltip.scss';
import { useTranslation } from 'react-i18next';

const renderDate = (index, payload, item) => {
  const { t, i18n } = useTranslation();
  return index === payload.length - 1 ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000)
        .toLocaleString(localeString(i18n), { month: 'long' })
        .charAt(0)
        .toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString(localeString(i18n), { month: 'long' }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate().toLocaleString(localeString(i18n))},{' '}
      {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ''
  );
};

const renderItem = (type, item) => {
  const { t, i18n } = useTranslation();
  return type === '$' ? (
    <Typography variant="body2">{`${type}${Math.round(item).toLocaleString(i18n)}`}</Typography>
  ) : (
    <Typography variant="body2">{`${Math.round(item).toLocaleString(i18n)}${type}`}</Typography>
  );
};

const renderTooltipItems = (payload, bulletpointColors, itemNames, itemType, isStaked = false, isPOL = false) => {
  const { t } = useTranslation();
  return isStaked ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          {t('components.staked')}
        </Typography>
        <Typography>{`${trim(payload[0].value, 2)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
          {t('components.notStaked')}
        </Typography>
        <Typography>{`${trim(100 - payload[0].value, 2)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : isPOL ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          {itemNames[0]}
        </Typography>
        <Typography>{`${trim(payload[0].value, 2)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
          {itemNames[1]}
        </Typography>
        <Typography>{`${(100 - payload[0].value).toFixed(2)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : (
    payload.map((item, index) => (
      <Box key={index}>
        <Box className="item" display="flex">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">
              <span className="tooltip-bulletpoint" style={bulletpointColors[index]}></span>
              {`${itemNames[index]}`}
            </Typography>
          </Box>
          {renderItem(itemType, item.value)}
        </Box>
        <Box>{renderDate(index, payload, item)}</Box>
      </Box>
    ))
  );
};

function CustomTooltip({ active, payload, bulletpointColors, itemNames, itemType, isStaked, isPOL }) {
  if (active && payload && payload.length) {
    return (
      <Paper className={`ohm-card tooltip-container`}>
        {renderTooltipItems(payload, bulletpointColors, itemNames, itemType, isStaked, isPOL)}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
