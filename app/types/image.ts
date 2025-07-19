export { }

declare global {
  interface ImageModifiers {
    width: number
    height: number
    fit: string
    format: string
    [key: string]: any
  }

  interface ImageOptions {
    provider?: string
    preset?: string
    modifiers?: Partial<ImageModifiers>
    [key: string]: any
  }

  interface ImageSizesOptions extends ImageOptions {
    sizes: Record<string, string | number> | string
  }

  type ProviderGetImage = (
    src: string,
    options: ImageOptions,
    ctx: ImageCTX
  ) => ResolvedImage

  interface ImageProvider {
    defaults?: any
    getImage: ProviderGetImage
    validateDomains?: boolean
    supportsAlias?: boolean
  }

  interface CreateImageOptions {
    providers: {
      [name: string]: {
        defaults: any
        provider: ImageProvider
      }
    }
    presets: { [name: string]: ImageOptions }
    provider: string
    screens: Record<string, number>
    alias: Record<string, string>
    domains: string[]
  }

  interface ImageInfo {
    width: number
    height: number
    placeholder?: string
  }

  interface ResolvedImage {
    url: string
    format?: string
    getMeta?: () => Promise<ImageInfo>
  }

  interface ImageSizes {
    srcset: string
    sizes: string
    src: string
  }

  interface Img {
    (
      source: string,
      modifiers?: ImageOptions['modifiers'],
      options?: ImageOptions
    ): ResolvedImage['url']
    options: CreateImageOptions
    getImage: (source: string, options?: ImageOptions) => ResolvedImage
    getSizes: (
      source: string,
      options?: ImageOptions,
      sizes?: string[]
    ) => ImageSizes
    getMeta: (source: string, options?: ImageOptions) => Promise<ImageInfo>
  }

  type $Img = Img & {
    [preset: string]: $Img
  }

  interface ImageCTX {
    options: CreateImageOptions
    $img?: $Img
  }

  interface ImageSize {
    width: number
    media: string
    breakpoint: number
    format: string
    url: string
  }

  interface RuntimePlaceholder extends ImageInfo {
    url: string
  }

  type OperationFormatter = (key: string, value: string) => string

  type OperationMapper
    = | { [key: string]: string | false }
      | ((key: string) => string)

  interface OperationGeneratorConfig {
    keyMap?: OperationMapper
    formatter?: OperationFormatter
    joinWith?: string
    valueMap?: {
      [key: string]: OperationMapper
    }
  }

  type MapToStatic = (image: ResolvedImage, input: string) => string
}
