import {getObjectTypedKeys, pickObjectKeys} from '@augment-vir/common';
import {TemplateResult} from 'element-vir';
import {Writable} from 'type-fest';
import {Dimensions} from './util/dimensions';

const nftConfigConst = {
    nftUrl: '' as string,
    /**
     * URL for the child NFT iframe. If none are provided, this defaults to Toniq Lab's own NFT
     * iframe URL.
     */
    childFrameUrl: '' as string,
    /** The max NFT size constraints which the NFT will be resized to fit within. */
    max: undefined as Dimensions | undefined,
    /** The min NFT size constraints which the NFT will be resized to fit within. */
    min: undefined as Dimensions | undefined,
    /** How long to wait for the nft to load before calculating size. Defaults to 500 milliseconds. */
    loadWaitDuration: {
        milliseconds: 500,
    },
    /** For hard-coding the final NFT size. Setting this can cause distortions. */
    forcedFinalNftSize: undefined as Dimensions | undefined,
    /**
     * This force the NFT's dimensions instead of trying to automatically detect the NFT's
     * dimensions.
     */
    forcedOriginalNftSize: undefined as Dimensions | undefined,
    /**
     * An HTML string that will be interpolated into the child NFT iframe. For any operations that
     * need to run before size calculations are completed, wrap them in a globally defined function
     * named executeBeforeSize inside a <script> element.
     */
    extraHtml: undefined as string | undefined | TemplateResult,
    /** Query selector to use to determine an html result's size. */
    htmlSizeQuerySelector: undefined as string | undefined,
    /**
     * When set to true, videos will not auto play their video (audio is always programmatically
     * muted).
     */
    blockAutoPlay: undefined as boolean | undefined,
    /** Block interaction with NFTs, even on HTML pages. */
    blockInteraction: undefined as boolean | undefined,
    /** Set to true to allow scrolling of text and HTML NFT types. */
    allowScrolling: undefined as boolean | undefined,
    /** Set to true to disable lazy loading. */
    eagerLoading: undefined as boolean | undefined,
    /** Timeout for each loading phase in milliseconds. */
    timeoutMs: undefined as number | undefined,
    /**
     * Set this to true to block usage of the persistent cache, which lasts longer than a single
     * session. Settings this to true will negatively impact performance but will make sure NFTs are
     * up to date.
     */
    blockPersistentCache: undefined as boolean | undefined,
    /** Set this to true to prevent removal of console method calls inside of the child iframe. */
    allowConsoleLogs: undefined as boolean | undefined,
    hideError: undefined as boolean | undefined,
} as const;

export type NftFrameConfig = Writable<
    {
        [Prop in keyof typeof nftConfigConst as undefined extends (typeof nftConfigConst)[Prop]
            ? never
            : Prop]: (typeof nftConfigConst)[Prop];
    } & {
        [Prop in keyof typeof nftConfigConst as undefined extends (typeof nftConfigConst)[Prop]
            ? Prop
            : never]?: (typeof nftConfigConst)[Prop];
    }
>;

export function toChildNftConfig(NftConfig: NftFrameConfig & Record<PropertyKey, unknown>) {
    /**
     * Use pickObjectKeys a filter on the keys (rather than omitObjectKeys directly) to ensure that
     * we only pick expected keys, in case external sources include unexpected keys.
     */
    return pickObjectKeys(
        NftConfig,
        getObjectTypedKeys(nftConfigConst).filter(
            (key): key is keyof NftFrameConfig =>
                // don't send the child frame url to the frame
                key !== 'childFrameUrl',
        ),
    );
}

export type NftConfigForChildIframe = ReturnType<typeof toChildNftConfig>;

export const defaultTimeoutMs: number = 10_000;
