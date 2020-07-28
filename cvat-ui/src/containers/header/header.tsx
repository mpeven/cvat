// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';

import getCore from 'cvat-core-wrapper';
import HeaderComponent from 'components/header/header';
import { SupportedPlugins, CombinedState } from 'reducers/interfaces';
import { logoutAsync } from 'actions/auth-actions';
import { switchSettingsDialog } from 'actions/settings-actions';
import { authActions } from 'actions/auth-actions';

const core = getCore();

interface StateToProps {
    logoutFetching: boolean;
    installedAnalytics: boolean;
    installedAutoAnnotation: boolean;
    installedTFSegmentation: boolean;
    installedTFAnnotation: boolean;
    username: string;
    toolName: string;
    serverHost: string;
    serverVersion: string;
    serverDescription: string;
    coreVersion: string;
    canvasVersion: string;
    uiVersion: string;
    switchSettingsShortcut: string;
    settingsDialogShown: boolean;
    changePasswordDialogShown: boolean;
    changePasswordFetching: boolean;
    renderChangePasswordItem: boolean,
}

interface DispatchToProps {
    onLogout: () => void;
    switchSettingsDialog: (show: boolean) => void;
    switchChangePasswordDialog: (show: boolean) => void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        auth: {
            fetching: logoutFetching,
            fetching: changePasswordFetching,
            user: {
                username,
            },
            showChangePasswordDialog: changePasswordDialogShown,
            allowChangePassword: renderChangePasswordItem,
        },
        plugins: {
            list,
        },
        about: {
            server,
            packageVersion,
        },
        shortcuts: {
            normalizedKeyMap,
        },
        settings: {
            showDialog: settingsDialogShown,
        },
    } = state;

    return {
        logoutFetching,
        installedAnalytics: list[SupportedPlugins.ANALYTICS],
        installedAutoAnnotation: list[SupportedPlugins.AUTO_ANNOTATION],
        installedTFSegmentation: list[SupportedPlugins.TF_SEGMENTATION],
        installedTFAnnotation: list[SupportedPlugins.TF_ANNOTATION],
        username,
        toolName: server.name as string,
        serverHost: core.config.backendAPI.slice(0, -7),
        serverDescription: server.description as string,
        serverVersion: server.version as string,
        coreVersion: packageVersion.core,
        canvasVersion: packageVersion.canvas,
        uiVersion: packageVersion.ui,
        switchSettingsShortcut: normalizedKeyMap.OPEN_SETTINGS,
        settingsDialogShown,
        changePasswordFetching,
        changePasswordDialogShown,
        renderChangePasswordItem: renderChangePasswordItem,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        onLogout: (): void => dispatch(logoutAsync()),
        switchSettingsDialog: (show: boolean): void => dispatch(switchSettingsDialog(show)),
        switchChangePasswordDialog: (show: boolean): void => dispatch(authActions.switchChangePasswordDialog(show)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderComponent);
