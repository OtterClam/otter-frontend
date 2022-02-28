import { Paper, Box, Typography } from '@material-ui/core';
import { trim, localeString } from '../../helpers';
import './customtooltip.scss';
import { useTranslation } from 'react-i18next';

const renderDate = (i18n, index, payload, item) => {
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

const renderItem = (i18n, type, item) => {
  return type === '$' ? (
    <Typography variant="body2" className={item.name}>{`${type}${Math.round(item.value).toLocaleString(
      i18n,
    )}`}</Typography>
  ) : (
    <Typography variant="body2">{`${Math.round(item.value).toLocaleString(i18n)}${type}`}</Typography>
  );
};

const renderTooltipItems = (
  t,
  i18n,
  payload,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked = false,
  isPOL = false,
) => {
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
      <Box>{renderDate(i18n, 0, payload, payload[0])}</Box>
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
      <Box>{renderDate(i18n, 0, payload, payload[0])}</Box>
    </Box>
  ) : (
    payload.map((item, index) => {
      return (
        <Box key={index}>
          <Box className="item" display="flex">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" className={item.name}>
                <span className={`tooltip-bulletpoint ${item.name}`} style={bulletpointColors[index]}></span>
                {`${itemNames[index]}`}
              </Typography>
            </Box>
            {renderItem(i18n, itemType, item)}
          </Box>
          <Box>{renderDate(i18n, index, payload, item)}</Box>
        </Box>
      );
    })
  );
};

function CustomTooltip({ active, payload, bulletpointColors, itemNames, itemType, isStaked, isPOL }) {
  const { t, i18n } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <Paper className={`ohm-card tooltip-container`}>
        {renderTooltipItems(t, i18n, payload, bulletpointColors, itemNames, itemType, isStaked, isPOL)}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
