import { Slide } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import { Theme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import * as React from 'react';

const icon = (
  <Paper sx={{ m: 1 }} elevation={4}>
    <Box component='svg' sx={{ width: 100, height: 100 }}>
      <Box
        component='polygon'
        sx={{
          fill: (theme: Theme) => theme.palette.common.white,
          stroke: (theme) => theme.palette.divider,
          strokeWidth: 1,
        }}
        points='0,100 50,00, 100,100'
      />
    </Box>
  </Paper>
);

export default function SimpleGrow() {
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);

  const [checked3, setChecked3] = React.useState(false);

  const [checked4, setChecked4] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const handleChange2 = () => {
    setChecked2((prev) => !prev);
  };
  const handleChange3 = () => {
    setChecked3((prev) => !prev);
  };
  const handleChange4 = () => {
    setChecked4((prev) => !prev);
  };

  return (
    <Box sx={{ height: 180 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label='Show'
      />
      <FormControlLabel
        control={<Switch checked={checked2} onChange={handleChange2} />}
        label='Show'
      />
      <FormControlLabel
        control={<Switch checked={checked3} onChange={handleChange3} />}
        label='Show'
      />
      <FormControlLabel
        control={<Switch checked={checked4} onChange={handleChange4} />}
        label='Show'
      />
      <Box sx={{ display: 'flex' }}>
        {/* <Grow in={checked}>{icon}</Grow>
        <Grow in={checked}>{icon}</Grow>
        <Grow in={checked}>{icon}</Grow> */}

        {/* Conditionally applies the timeout prop to change the entry speed. */}
        {/* <Grow
          in={checked}
          style={{ transformOrigin: '0 0 0' }}
          {...(checked ? { timeout: 1000 } : {})}
        >
          {icon}
        </Grow> */}
        <Slide direction='right' in={checked} mountOnEnter unmountOnExit>
          {icon}
        </Slide>
        <Slide direction='right' in={checked2} mountOnEnter unmountOnExit>
          {icon}
        </Slide>
        <Slide direction='right' in={checked3} mountOnEnter unmountOnExit>
          {icon}
        </Slide>
        <Slide direction='right' in={checked4} mountOnEnter unmountOnExit>
          {icon}
        </Slide>
      </Box>
    </Box>
  );
}
