/**
 * Hexo Fluid 主题 - 代码注入功能类型声明
 * 提供 Hexo 注入器与 Fluid 注入功能的完整类型提示
 * @see https://hexo.fluid-dev.com/docs/advance/
 */

// ==================== Hexo 注入器类型定义 ====================

declare module 'hexo' {
  /**
   * Hexo 注入器的注入位置
   * @see https://hexo.io/zh-cn/api/injector.html
   */
  type InjectPosition = 
    | 'head_begin'   // 注入在 <head> 之后（默认）
    | 'head_end'     // 注入在 </head> 之前
    | 'body_begin'   // 注入在 <body> 之后
    | 'body_end';    // 注入在 </body> 之前

  /**
   * Hexo 注入器的页面类型过滤
   */
  type InjectPageType =
    | 'default'      // 【默认】注入到每个页面
    | 'home'         // 只注入到主页（is_home() 为 true）
    | 'post'         // 只注入到文章页面（is_post() 为 true）
    | 'page'         // 只注入到独立页面（is_page() 为 true）
    | 'archive'      // 只注入到归档页面（is_archive() 为 true）
    | 'category'     // 只注入到分类页面（is_category() 为 true）
    | 'tag'          // 只注入到标签页面（is_tag() 为 true）
    | string;        // 自定义 layout 名称（如 about, links）

  interface HexoInjector {
    /**
     * 注册注入代码
     * @param position - 注入位置（head_begin/head_end/body_begin/body_end）
     * @param content - 注入的 HTML 片段，可以是字符串或返回字符串的函数
     * @param pageType - 页面类型过滤，默认为 'default'
     * @example
     * ```js
     * hexo.extend.injector.register('body_end', '<script src="/jquery.js"></script>', 'default');
     * ```
     */
    register(position: InjectPosition, content: string | (() => string), pageType?: InjectPageType): void;
  }

  interface Extend {
    injector: HexoInjector;
  }
}

// ==================== Fluid 主题注入点类型定义 ====================

/**
 * Fluid 注入点配置参数
 */
interface FluidInjectOptions {
  /** 传入 EJS 模板的参数对象 */
  locals?: Record<string, any>;
  /** 缓存配置，默认 true */
  cache?: boolean;
}

/**
 * Fluid 文件注入方法参数
 */
interface FluidFileInjectOptions extends FluidInjectOptions {
  key?: string;
}

/**
 * Fluid 注入点对象 - 提供 file 和 raw 两个方法
 */
interface FluidInjectPoint {
  /**
   * 注入 EJS 文件
   * @param key - 注入键名，相同键名会覆盖，不同键名依次排列
   * @param filePath - EJS 文件路径（相对于博客根目录）
   * @param locals - 传入 EJS 文件的参数（可选）
   * @param options - 配置参数（可选）
   * @param order - 顺序，数值越小越靠前（可选，默认按执行顺序）
   * @example
   * ```js
   * injects.header.file('default', 'source/_inject/test1.ejs', { key: 'value' }, { cache: true }, -1);
   * ```
   */
  file(key: string, filePath: string, locals?: Record<string, any>, options?: FluidInjectOptions, order?: number): void;
  
  /**
   * 注入原生 HTML 代码
   * @param key - 注入键名，相同键名会覆盖，不同键名依次排列
   * @param content - 原生 HTML 语句
   * @param options - 配置参数（可选）
   * @param order - 顺序，数值越小越靠前（可选）
   * @example
   * ```js
   * injects.footer.raw('default', '<script async src="https://xxxxxx"></script>');
   * ```
   */
  raw(key: string, content: string, options?: FluidInjectOptions, order?: number): void;
}

/**
 * Fluid 主题所有注入点的集合
 * @see https://hexo.fluid-dev.com/docs/advance/#fluid-%E6%B3%A8%E5%85%A5%E4%BB%A3%E7%A0%81
 */
interface FluidInjectPoints {
  /**
   * <head> 标签中的结尾位置
   * @default 无 default 键
   */
  head: FluidInjectPoint;
  
  /**
   * <header> 标签中所有内容
   * @default 有 default 键
   */
  header: FluidInjectPoint;
  
  /**
   * <body> 标签中的开始位置
   * @default 无 default 键
   */
  bodyBegin: FluidInjectPoint;
  
  /**
   * <body> 标签中的结尾位置
   * @default 无 default 键
   */
  bodyEnd: FluidInjectPoint;
  
  /**
   * <footer> 标签中所有内容
   * @default 有 default 键
   */
  footer: FluidInjectPoint;
  
  /**
   * 文章页 <header> 标签中 meta 部分内容（顶部）
   * @default 有 default 键
   */
  postMetaTop: FluidInjectPoint;
  
  /**
   * 文章页底部 meta 部分内容
   * @default 有 default 键
   */
  postMetaBottom: FluidInjectPoint;
  
  /**
   * <div class="markdown-body"> 标签中的开始位置（文章内容之前）
   * @default 无 default 键
   */
  postMarkdownBegin: FluidInjectPoint;
  
  /**
   * <div class="markdown-body"> 标签中的结尾位置（文章内容之后）
   * @default 无 default 键
   */
  postMarkdownEnd: FluidInjectPoint;
  
  /**
   * 文章页左侧边栏
   * @default 有 default 键
   */
  postLeft: FluidInjectPoint;
  
  /**
   * 文章页右侧边栏
   * @default 有 default 键
   */
  postRight: FluidInjectPoint;
  
  /**
   * 文章页版权信息区域
   * @default 有 default 键
   */
  postCopyright: FluidInjectPoint;
  
  /**
   * 文章页评论区
   * @default 有 default 键
   */
  postComments: FluidInjectPoint;
  
  /**
   * 自定义页评论区
   * @default 有 default 键
   */
  pageComments: FluidInjectPoint;
  
  /**
   * 友链页评论区
   * @default 有 default 键
   */
  linksComments: FluidInjectPoint;
}

/**
 * Fluid 主题过滤器参数
 */
interface FluidThemeFilters {
  /**
   * 注册主题注入代码
   * @param injects - 注入点集合对象
   * @example
   * ```js
   * hexo.extend.filter.register('theme_inject', function(injects) {
   *   injects.header.file('default', 'source/_inject/header.ejs');
   *   injects.footer.raw('default', '<div>自定义内容</div>');
   * });
   * ```
   */
  theme_inject(injects: FluidInjectPoints): void;
}

declare module 'hexo' {
  interface Hexo {
    /**
     * 注册主题注入过滤器
     * @example
     * ```js
     * hexo.extend.filter.register('theme_inject', (injects) => {
     *   // 注入 EJS 文件到 header
     *   injects.header.file('myComponent', 'source/_inject/my-component.ejs', { title: 'Hello' });
     *   
     *   // 注入原生 HTML 到 footer
     *   injects.footer.raw('myScript', '<script>console.log("injected")</script>');
     * });
     * ```
     */
    extend: Extend & {
      filter: {
        register<K extends keyof FluidThemeFilters>(
          name: K,
          callback: FluidThemeFilters[K],
          priority?: number
        ): void;
      };
    };
  }
}

// ==================== 便捷使用示例 ====================

/**
 * 在 /scripts/ 目录下创建任意 .js 文件，使用以下示例代码：
 * 
 * @example 方式一：Hexo 原生注入器
 * ```js
 * hexo.extend.injector.register('body_end', '<script src="/my-script.js"></script>', 'default');
 * ```
 * 
 * @example 方式二：Fluid 主题注入（EJS 文件方式）
 * ```js
 * hexo.extend.filter.register('theme_inject', (injects) => {
 *   // 注入 EJS 模板文件
 *   injects.header.file('myHeader', 'source/_inject/header.ejs', { 
 *     title: '自定义标题' 
 *   }, { cache: true }, 10);
 *   
 *   // 注入原生代码
 *   injects.footer.raw('myAnalytics', '<script async src="https://example.com/analytics.js"></script>');
 *   
 *   // 注入到文章页评论区上方
 *   injects.postComments.file('customComment', 'source/_inject/custom-comment.ejs');
 * });
 * ```
 * 
 * @example 方式三：传入参数的 EJS 模板示例
 * 创建 source/_inject/header.ejs 文件：
 * ```ejs
 * <div class="custom-header">
 *   <h2><%= title %></h2>
 * </div>
 * ```
 */

// 导出空模块，使文件成为模块声明
export {};