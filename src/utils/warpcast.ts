import validator from 'validator';
const isUrl = validator.isURL;

interface WarpcastComposeOptions {
  text: string;
  embeds?: string[];
  parentCastHash?: string;
  channelKey?: string;
}

const hashPattern = /^0x[a-fA-F0-9]{40}$/; // regex pattern for hash validation

export class WarpcastUrlBuilder {
  private static readonly COMPOSER_BASE_URL = 'https://warpcast.com/~/compose';

  /**
   * Generates a Warpcast composer URL with the given options,
   * docs at https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents
   * @param options.text - The text of the post
   *
   * @param options.embeds - The embeds to include in the post (max 2)
   *
   * @param options.parentCastHash - The parent cast hash for replies,
   * `/^0x[a-fA-F0-9]{40}$/`,
   * overrides `options.channelKey`
   *
   * @param options.channelKey - The name of the channel to post to
   *
   * @returns The composer URL
   */
  static composerUrl(options: WarpcastComposeOptions): string {
    const params = new URLSearchParams();

    // Add required text parameter
    params.append('text', encodeURIComponent(options.text));

    // Add optional embeds
    if (options.embeds?.length) {
      if (options.embeds?.length && options.embeds?.length > 2) {
        throw new Error('Warpcast does not support more than 2 embeds');
      }
      const isValidEmbeds =
        isUrl(options.embeds?.[0]) && isUrl(options.embeds?.[1]) ? true : false;
      if (!isValidEmbeds) {
        console.error('Error: Invalid URLs for embeds');
        throw new Error('Embed strings must be valid URLs');
      }
      options.embeds.forEach((embed) => params.append('embeds[]', embed));
    }

    // Add optional channel
    if (options.channelKey) {
      params.append('channelKey', options.channelKey);
    }

    // Add optional parent cast hash for replies
    if (options.parentCastHash) {
      if (!hashPattern.test(options.parentCastHash)) {
        throw new Error('Invalid parent cast hash');
      }
      params.append('parentCastHash', options.parentCastHash);
    }

    return `${this.COMPOSER_BASE_URL}?${params.toString()}`;
  }

  /**
   * Generates a Warpcast profile URL for the given fid, docs at
   * docs at https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents
   * @param fid - The fid of the user
   *
   * @returns The profile URL
   */
  static profileUrl(fid: number): string {
    return `https://warpcast.com/~/profiles/${fid.toString()}`;
  }

  /**
   * Generates a Warpcast conversation URL for the given hash, docs at
   * docs at https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents
   * @param hash - The hash of the cast, `/^0x[a-fA-F0-9]{40}$/`
   *
   * @returns The warpcast conversation URL
   */
  static castUrlByHash(hash: string): string {
    if (!hashPattern.test(hash)) {
      throw new Error('Invalid cast hash');
    }
    return `https://warpcast.com/~/conversations/${hash}`;
  }
}

//debug
(() => {
  const url = WarpcastUrlBuilder.composerUrl({
    text: 'Hello World!',
    embeds: [
      'https://events.xyz/events/2223b818',
      'https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents',
    ],
    parentCastHash: '',
    channelKey: 'testinprod',
  });
  console.log('composer url test:', url);
  console.log('profile url test:', WarpcastUrlBuilder.profileUrl(9391));
  console.log(
    'cast url test:',
    WarpcastUrlBuilder.castUrlByHash(
      '0x6c48f6fa5060edf19af7ec9fad5028b0ba2e7a3c'
    )
  );
})();
