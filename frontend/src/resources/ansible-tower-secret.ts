/* Copyright Contributors to the Open Cluster Management project */

import { V1ObjectMeta, V1Secret } from '@kubernetes/client-node'
import * as YAML from 'yamljs'
import { IResourceDefinition } from './resource'
import { createResource, getResource, replaceResource } from '../lib/resource-request'

export const AnsibleTowerSecretApiVersion = 'v1'
export type AnsibleTowerSecretApiVersionType = 'v1'

export const AnsibleTowerSecretKind = 'Secret'
export type AnsibleTowerSecretKindType = 'Secret'

export const AnsibleTowerSecretDefinition: IResourceDefinition = {
    apiVersion: AnsibleTowerSecretApiVersion,
    kind: AnsibleTowerSecretKind,
}

export interface AnsibleTowerSecret extends V1Secret {
    apiVersion: AnsibleTowerSecretApiVersionType
    kind: AnsibleTowerSecretKindType
    metadata: V1ObjectMeta
    data?: {
        metadata: string
    }
    spec?: {
        host?: string
        token?: string
    }
}

export function getAnsibleTowerSecret(metadata: { name: string; namespace: string }) {
    const result = getResource<AnsibleTowerSecret>({
        apiVersion: AnsibleTowerSecretApiVersion,
        kind: AnsibleTowerSecretKind,
        metadata,
    })
    return {
        promise: result.promise.then(unpackAnsibleTowerSecret),
        abort: result.abort,
    }
}

export function createAnsibleTowerSecret(AnsibleTowerSecret: AnsibleTowerSecret) {
    if (!AnsibleTowerSecret.metadata) {
        AnsibleTowerSecret.metadata = {}
    }
    if (!AnsibleTowerSecret.metadata.labels) {
        AnsibleTowerSecret.metadata.labels = {}
    }
    AnsibleTowerSecret.metadata.labels['cluster.open-cluster-management.io/provider'] = 'ans'
    AnsibleTowerSecret.metadata.labels['cluster.open-cluster-management.io/cloudconnection'] = '' // is this appropriate for ans?
    return createResource<AnsibleTowerSecret>(packAnsibleTowerSecret({ ...AnsibleTowerSecret }))
}

export function replaceAnsibleTowerSecret(AnsibleTowerSecret: AnsibleTowerSecret) {
    return replaceResource<AnsibleTowerSecret>(packAnsibleTowerSecret({ ...AnsibleTowerSecret }))
}

export function unpackAnsibleTowerSecret(AnsibleTowerSecret: AnsibleTowerSecret) {
    if (AnsibleTowerSecret.data) {
        try {
            const yaml = Buffer.from(AnsibleTowerSecret?.data?.metadata, 'base64').toString('ascii')
            AnsibleTowerSecret.spec = YAML.parse(yaml)
        } catch {}
    } else if (AnsibleTowerSecret.stringData) {
        try {
            AnsibleTowerSecret.spec = YAML.parse(AnsibleTowerSecret.stringData.metadata)
        } catch {}
    }
    delete AnsibleTowerSecret.stringData
    delete AnsibleTowerSecret.data
    return AnsibleTowerSecret
}

export function packAnsibleTowerSecret(AnsibleTowerSecret: AnsibleTowerSecret) {
    if (AnsibleTowerSecret.spec) {
        AnsibleTowerSecret.stringData = { metadata: YAML.stringify(AnsibleTowerSecret.spec) }
    }
    delete AnsibleTowerSecret.spec
    delete AnsibleTowerSecret.data
    return AnsibleTowerSecret
}