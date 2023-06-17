import { Casino, PanTool, PeopleAlt } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import {
  alpha,
  Box,
  Button,
  List,
  ListItem,
  ListSubheader,
  styled,
} from '@mui/material';
import { useAtom } from 'jotai';
import _ from 'lodash';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { useGetMyUser } from '@/hooks/user/useUser';

import { bankAtom, contactAtom, userAtom } from '@/store/user';

import { SidebarContext } from '@/contexts/SidebarContext';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity',
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const [sideBarMenu, setSideBarMenu] = useState();
  const router = useRouter();
  const currentRoute = router.pathname;
  const [user, setUser] = useAtom(userAtom);
  const [bank, setBank] = useAtom(bankAtom);
  const [contact, setContact] = useAtom(contactAtom);

  const getMyUserHook = useGetMyUser();

  const getMyUserData = async () => {
    const res: any = await getMyUserHook.mutateAsync();
    if (res?.status === 'success') {
      setUser(res?.userData?.user);
      setBank(res?.userData?.bank);
      setContact(res?.userData?.contact);

      const permissions = res?.userData?.user?.permissions
        .filter((permission) => permission.access)
        .map((permission) => permission?.title);

      setSideBarMenu(permissions);
    }
  };

  useEffect(() => {
    getMyUserData();
  }, []);

  useEffect(() => {
    return;
  }, [user]);

  return (
    <>
      <MenuWrapper>
        {/* <List component='div'>
          <SubMenuWrapper>
            <List component='div'>
              <ListItem component='div'>
                <NextLink href='/' passHref>
                  <Button
                    className={currentRoute.includes('="/' )? 'active' : ''}
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<DesignServicesTwoToneIcon />}
                  >
                    Overview
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
        {/* <List
          component='div'
          subheader={
            <ListSubheader component='div' disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component='div'>
              <ListItem component='div'>
                <NextLink href='/' passHref>
                  <Button
                    className={currentRoute === '/' ? 'active' : ''}
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<BrightnessLowTwoToneIcon />}
                  >
                    Overview
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/applications/messenger' passHref>
                  <Button
                    className={
                      currentRoute.includes('/applications/messenger')
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<MmsTwoTone />}
                  >
                    Messenger
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
        {_.intersection(
          [
            'Customers',
            'Staff',
            'Transactions List',
            'Wallet Settings',
            'Deposit Request',
          ],
          sideBarMenu
        )?.length ? (
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>
                Management
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                {_.intersection(['Deposit Request'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/management/requests' passHref>
                      <Button
                        className={
                          currentRoute.includes('/management/requests')
                            ? 'active'
                            : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<PanTool />}
                      >
                        Deposit Request
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}
                {_.intersection(['Customers'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/management/customers' passHref>
                      <Button
                        className={
                          currentRoute.includes('/management/customers')
                            ? 'active'
                            : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<PeopleAlt />}
                      >
                        Customers
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}

                {_.intersection(['Staff'], sideBarMenu)?.length &&
                user?.type === 'superadmin' ? (
                  <ListItem component='div'>
                    <NextLink href='/management/staff' passHref>
                      <Button
                        className={
                          currentRoute.includes('/management/staff')
                            ? 'active'
                            : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<PeopleAlt />}
                      >
                        Staff
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}
                {_.intersection(['Transactions List'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/management/transactions' passHref>
                      <Button
                        className={
                          currentRoute.includes('/management/transactions')
                            ? 'active'
                            : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<TableChartTwoToneIcon />}
                      >
                        Transactions List
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}
                {_.intersection(['Wallet Settings'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/management/wallet' passHref>
                      <Button
                        className={
                          currentRoute.includes('/management/wallet')
                            ? 'active'
                            : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<AccountBalanceWalletIcon />}
                      >
                        Wallet Settings
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}

                {/* <ListItem component='div'>
                  <NextLink href='/management/wallet' passHref>
                    <Button
                      className={
                        currentRoute.includes('/management/wallet')
                          ? 'active'
                          : ''
                      }
                      disableRipple
                      component='a'
                      onClick={closeSidebar}
                      startIcon={<AccountBalanceWalletIcon />}
                    >
                      Wallet
                    </Button>
                  </NextLink>
                </ListItem> */}
              </List>
            </SubMenuWrapper>
          </List>
        ) : (
          ''
        )}
        {_.intersection(['Game', 'Game Settings'], sideBarMenu)?.length ? (
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>
                Play
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                {_.intersection(['Game'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/play/game' passHref>
                      <Button
                        className={
                          currentRoute.includes('/play/game') ? 'active' : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<Casino />}
                      >
                        Game
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}
                {_.intersection(['Game Settings'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/play/setting/' passHref>
                      <Button
                        className={
                          currentRoute.includes('/play/setting') ? 'active' : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<Casino />}
                      >
                        Game Settings
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}

                {/* <ListItem component='div'>
                        <NextLink href='/management/profile/settings' passHref>
                          <Button
                            className={
                              currentRoute.includes('/management/profile/settings'
                                )? 'active'
                                : ''
                            }
                            disableRipple
                            component='a'
                            onClick={closeSidebar}
                            startIcon={<DisplaySettingsTwoToneIcon />}
                          >
                            Create
                          </Button>
                        </NextLink>
                      </ListItem> */}
              </List>
            </SubMenuWrapper>
          </List>
        ) : (
          ''
        )}
        {_.intersection(
          ['Game Report', 'Withdrawal Report', 'Deposit Request'],
          sideBarMenu
        )?.length ? (
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>
                Reports
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                {_.intersection(['Game Report'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/report/game' passHref>
                      <Button
                        className={
                          currentRoute.includes('/report/game') ? 'active' : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<Casino />}
                      >
                        Game Report
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}
                {_.intersection(['Withdrawal Report'], sideBarMenu)?.length ? (
                  <ListItem component='div'>
                    <NextLink href='/report/withdraw' passHref>
                      <Button
                        className={
                          currentRoute.includes('/report/withdraw')
                            ? 'active'
                            : ''
                        }
                        disableRipple
                        component='a'
                        onClick={closeSidebar}
                        startIcon={<Casino />}
                      >
                        Withdrawal Report
                      </Button>
                    </NextLink>
                  </ListItem>
                ) : (
                  ''
                )}

                {/* <ListItem component='div'>
              <NextLink href='/management/profile/settings' passHref>
                <Button
                  className={
                    currentRoute.includes('/management/profile/settings'
                      )? 'active'
                      : ''
                  }
                  disableRipple
                  component='a'
                  onClick={closeSidebar}
                  startIcon={<DisplaySettingsTwoToneIcon />}
                >
                  Create
                </Button>
              </NextLink>
            </ListItem> */}
              </List>
            </SubMenuWrapper>
          </List>
        ) : (
          ''
        )}

        {/* <List
          component='div'
          subheader={
            <ListSubheader component='div' disableSticky>
              Connections
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component='div'>
              <ListItem component='div'>
                <NextLink href='/management/profile' passHref>
                  <Button
                    className={
                      currentRoute.includes('/management/profile' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<Lan />}
                  >
                    Hierarchy
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/management/profile' passHref>
                  <Button
                    className={
                      currentRoute.includes('/management/profile' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<ConnectWithoutContact />}
                  >
                    Requests
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/management/profile/settings' passHref>
                  <Button
                    className={
                      currentRoute.includes('/management/profile/settings'
                        )? 'active'
                        : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<DisplaySettingsTwoToneIcon />}
                  >
                    Create
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
        {/* <List
          component='div'
          subheader={
            <ListSubheader component='div' disableSticky>
              Accounts
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component='div'>
              <ListItem component='div'>
                <NextLink href='/management/profile' passHref>
                  <Button
                    className={
                      currentRoute.includes('/management/profile')
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<AccountCircleTwoToneIcon />}
                  >
                    User Profile
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/management/profile/settings' passHref>
                  <Button
                    className={
                      currentRoute.includes('/management/profile/settings')
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<DisplaySettingsTwoToneIcon />}
                  >
                    Account Settings
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
        {/* <List
          component='div'
          subheader={
            <ListSubheader component='div' disableSticky>
              Components
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component='div'>
              <ListItem component='div'>
                <NextLink href='/components/buttons' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/buttons' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<BallotTwoToneIcon />}
                  >
                    Buttons
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/modals' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/modals' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<BeachAccessTwoToneIcon />}
                  >
                    Modals
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/accordions' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/accordions' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<EmojiEventsTwoToneIcon />}
                  >
                    Accordions
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/tabs' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/tabs' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<FilterVintageTwoToneIcon />}
                  >
                    Tabs
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/badges' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/badges' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<HowToVoteTwoToneIcon />}
                  >
                    Badges
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/tooltips' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/tooltips' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<LocalPharmacyTwoToneIcon />}
                  >
                    Tooltips
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/avatars' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/avatars' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<RedeemTwoToneIcon />}
                  >
                    Avatars
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/cards' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/cards' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<SettingsTwoToneIcon />}
                  >
                    Cards
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/components/forms' passHref>
                  <Button
                    className={
                      currentRoute.includes('/components/forms' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<TrafficTwoToneIcon />}
                  >
                    Forms
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
        {/* <List
          component='div'
          subheader={
            <ListSubheader component='div' disableSticky>
              Extra Pages
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component='div'>
              <ListItem component='div'>
                <NextLink href='/status/404' passHref>
                  <Button
                    className={currentRoute.includes('/status/404' )? 'active' : ''}
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<CheckBoxTwoToneIcon />}
                  >
                    Error 404
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/status/500' passHref>
                  <Button
                    className={currentRoute.includes('/status/500' )? 'active' : ''}
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<CameraFrontTwoToneIcon />}
                  >
                    Error 500
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/status/coming-soon' passHref>
                  <Button
                    className={
                      currentRoute.includes('/status/coming-soon' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<ChromeReaderModeTwoToneIcon />}
                  >
                    Coming Soon
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component='div'>
                <NextLink href='/status/maintenance' passHref>
                  <Button
                    className={
                      currentRoute.includes('/status/maintenance' )? 'active' : ''
                    }
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<WorkspacePremiumTwoToneIcon />}
                  >
                    Maintenance
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
