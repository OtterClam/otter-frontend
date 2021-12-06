import { Box, Typography } from '@material-ui/core';
import './countdown.scss';

const Number = ({ value }: { value: number }) => {
  return (
    <Box bgcolor="otter.otterBlue" component="span" className="nft-cd__number">
      <Typography component="span">{value}</Typography>
    </Box>
  );
};

export default function NFTCountdown() {
  return (
    <section className="nft-cd">
      <Box
        className="nft-cd__content"
        color="text.primary"
        bgcolor="mode.lightGray200"
        textAlign="center"
        component="div"
      >
        <Typography variant="h4" component="h2" className="nft-cd__title">
          Airdrop Countdown
        </Typography>
        <div className="nft-cd__numbers">
          <div className="nft-cd__number-group">
            <Number value={0} />
            <Number value={0} />
            <Typography component="span" className="nft-cd__number-label">
              Days
            </Typography>
          </div>

          <div className="nft-cd__number-group">
            <Number value={0} />
            <Number value={0} />
            <Typography component="span" className="nft-cd__number-label">
              Minutes
            </Typography>
          </div>

          <div className="nft-cd__number-group">
            <Number value={0} />
            <Number value={0} />
            <Typography component="span" className="nft-cd__number-label">
              Hours
            </Typography>
          </div>

          <div className="nft-cd__number-group">
            <Number value={0} />
            <Number value={0} />
            <Typography component="span" className="nft-cd__number-label">
              Seconds
            </Typography>
          </div>
        </div>
      </Box>
    </section>
  );
}
