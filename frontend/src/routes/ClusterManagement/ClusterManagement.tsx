/* Copyright Contributors to the Open Cluster Management project */

import {
    AcmAlertGroup,
    AcmAlertProvider,
    AcmErrorBoundary,
    AcmHeader,
    AcmPage,
    AcmRoute,
    AcmScrollable,
} from '@open-cluster-management/ui-components'
import {
    Divider,
    Nav,
    NavItem,
    NavList,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
} from '@patternfly/react-core'
import { createContext, ElementType, Fragment, lazy, ReactNode, Suspense, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { AppContext } from '../../components/AppContext'
import { NavigationPath } from '../../NavigationPath'

const ClustersPage = lazy(() => import('./Clusters/Clusters'))
const DiscoveredClustersPage = lazy(() => import('./DiscoveredClusters/DiscoveredClusters'))
const BareMetalAssetsPage = lazy(() => import('../BareMetalAssets/BareMetalAssetsPage'))

export const PageContext = createContext<{
    readonly actions: null | ReactNode
    setActions: (actions: null | ReactNode) => void
}>({
    actions: null,
    setActions: () => {},
})

export const usePageContext = (showActions: boolean, Component: ElementType) => {
    const { setActions } = useContext(PageContext)

    useEffect(() => {
        if (showActions) {
            setActions(<Component />)
        } else {
            setActions(null)
        }
        return () => setActions(null)
    }, [showActions, setActions, Component])

    return Component
}

export default function ClusterManagementPage() {
    const [actions, setActions] = useState<undefined | ReactNode>(undefined)
    const location = useLocation()
    const { t } = useTranslation(['cluster', 'bma'])
    const { featureGates } = useContext(AppContext)

    return (
        <AcmHeader route={AcmRoute.ClusterManagement}>
            <AcmAlertProvider>
                <AcmPage hasDrawer>
                    <PageContext.Provider value={{ actions, setActions }}>
                        <PageSection variant={PageSectionVariants.light}>
                            <TextContent>
                                <Text component="h1">{t('page.header.cluster-management')}</Text>
                                <Text component="p">{t('page.header.cluster-management.description')}</Text>
                            </TextContent>
                        </PageSection>
                        <Divider component="div" />
                        <PageSection variant={PageSectionVariants.light} type="nav" style={{ paddingTop: 0 }}>
                            <Nav variant="tertiary">
                                <NavList>
                                    <NavItem isActive={location.pathname.startsWith(NavigationPath.clusters)}>
                                        <Link to={NavigationPath.clusters}>{t('cluster:clusters')}</Link>
                                    </NavItem>
                                    {featureGates['open-cluster-management-discovery'] && (
                                        <NavItem
                                            isActive={location.pathname.startsWith(NavigationPath.discoveredClusters)}
                                        >
                                            <Link to={NavigationPath.discoveredClusters}>
                                                {t('cluster:clusters.discovered')}
                                            </Link>
                                        </NavItem>
                                    )}
                                    <NavItem isActive={location.pathname.startsWith(NavigationPath.bareMetalAssets)}>
                                        <Link to={NavigationPath.bareMetalAssets}>{t('bma:bmas')}</Link>
                                    </NavItem>
                                </NavList>
                            </Nav>
                        </PageSection>
                        <AcmErrorBoundary>
                            <AcmScrollable borderTop>
                                <PageSection variant="light" padding={{ default: 'noPadding' }}>
                                    <AcmAlertGroup isInline canClose alertMargin="0px 0px 8px 0px" />
                                </PageSection>
                                <Suspense fallback={<Fragment />}>
                                    <Switch>
                                        <Route exact path={NavigationPath.clusters} component={ClustersPage} />
                                        {featureGates['open-cluster-management-discovery'] && (
                                            <Route
                                                exact
                                                path={NavigationPath.discoveredClusters}
                                                component={DiscoveredClustersPage}
                                            />
                                        )}
                                        <Route
                                            exact
                                            path={NavigationPath.bareMetalAssets}
                                            component={BareMetalAssetsPage}
                                        />
                                        <Route exact path={NavigationPath.console}>
                                            <Redirect to={NavigationPath.clusters} />
                                        </Route>
                                    </Switch>
                                </Suspense>
                            </AcmScrollable>
                        </AcmErrorBoundary>
                    </PageContext.Provider>
                </AcmPage>
            </AcmAlertProvider>
        </AcmHeader>
    )
}
