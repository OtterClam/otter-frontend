import { makeStyles } from '@material-ui/core';
import RoundedButton from 'src/components/Otto/common/RoundedButton';
import { DescriptionMetadata } from './type';

const useStyles = makeStyles(theme => ({
  label: {
    color: theme.palette.mode.white,
    backgroundColor: theme.palette.otter.clamPink,
    fontSize: '24px',
  },
  content: {
    color: theme.palette.mode.otterDark,
    fontSize: '16px',
    lineHeight: '24px',
  },
  highlight: {
    color: theme.palette.otter.clamPink,
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

interface Props {
  metadata: DescriptionMetadata;
  number: number;
}
const OttoStepBox = ({ metadata, number }: Props) => {
  const classes = useStyles();
  return (
    <div className="otto-step-box__container">
      <div className={`otto-step-box__numberLabel ${classes.label}`}>{number}</div>
      <div className="otto-step-box__image" />
      {metadata.description.map((description, index) => {
        if (description.type === 'highlight')
          return (
            <span className={classes.highlight}>
              {description.text}
              <br />
            </span>
          );
        return (
          <span key={`desc-${index}`} className={classes.content}>
            {description.text}
          </span>
        );
      })}
      <div className="otto-step-box__button">
        <RoundedButton text={metadata.buttonText} />
      </div>
    </div>
  );
};

export default OttoStepBox;
