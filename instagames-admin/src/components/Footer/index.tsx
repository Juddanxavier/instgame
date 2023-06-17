import { Box, Container, Link, styled, Typography } from '@mui/material';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper
      sx={{
        marginTop: 'calc(10% + 60px)',
        position: 'fixed',
        bottom: 0,
      }}
    >
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems='center'
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent='space-between'
      >
        <Box>
          <Typography variant='subtitle1'>
            &copy; 2022 - Tokyo Free Black Next.js Typescript Admin Dashboard
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 },
          }}
          variant='subtitle1'
        >
          Crafted by{' '}
          <Link
            href='https://bloomui.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            BloomUI.com
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
