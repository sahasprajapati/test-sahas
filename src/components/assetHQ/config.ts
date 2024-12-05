import { Field } from 'payload/types';
import { AssetHQ } from '@/components/assetHQ'
//import { Meta, buildStateFromSchema, useAuth, useCollapsible, useConfig, useDocumentInfo, useEditDepth, useLocale, useTheme, withMergedProps } from 'payload/utilities'

const assetHQField: Field = {
    name: 'thumbnail',
    type: 'text',
    admin: {
        components: {
            Field: AssetHQ,
        },
        position: 'sidebar',
    }
};

export default assetHQField;