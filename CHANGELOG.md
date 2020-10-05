# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.31.0](https://github.com/tinacms/tinacms/compare/v0.30.0...v0.31.0) (2020-10-05)

### Bug Fixes

- **@tinacms/forms:** catch errors after submit ([2550a81](https://github.com/tinacms/tinacms/commit/2550a816ca7c4e99ea4965a179431510a9ca333f))
- missing key names ([798ed84](https://github.com/tinacms/tinacms/commit/798ed847b327ba2fe5cadf8be9a263c2e04b7220))
- svg attribute names ([7e06179](https://github.com/tinacms/tinacms/commit/7e06179fb1c54e04e286af946a618513fdeca19d))
- **@tinacms/forms:** the Form#fields array is now optional ([e3d71bf](https://github.com/tinacms/tinacms/commit/e3d71bf426e0d8e40076fc1e161350f9fe469543))
- **@tinacms/media:** deprecated since these interfaces were graduated to core ([39f1a72](https://github.com/tinacms/tinacms/commit/39f1a729a112fbab24af4c1e319cdc94867325aa))
- **@tinacms/react-alerts:** increase z-index ([94d67bb](https://github.com/tinacms/tinacms/commit/94d67bbb67588d08a6e926d70b1d3f55a34bc8bf)), closes [#1503](https://github.com/tinacms/tinacms/issues/1503) [#1055](https://github.com/tinacms/tinacms/issues/1055)
- **@tinacms/react-screens:** ModalBody is padded ([3df3c55](https://github.com/tinacms/tinacms/commit/3df3c5545072840c8f1be58ebf09535a6f86197d))

### Features

- **@tinacms/alerts:** events can be mapped to alerts automatically ([b96e8b9](https://github.com/tinacms/tinacms/commit/b96e8b9624f7afc53fc87ebdf5af08465fb419cd))
- **@tinacms/api-git:** GET /:relPath returns content list for directories ([c613b20](https://github.com/tinacms/tinacms/commit/c613b208b6387f5e2e31c70dd1bc747dd6ddb491))
- **@tinacms/api-git:** the GET /:relPath endpoint returns contents of directories ([9fa7bf8](https://github.com/tinacms/tinacms/commit/9fa7bf8c59a3cba99238138860a9bc2d52dee5d5))
- **@tinacms/core:** add cms.media.open top make showing the media manager easier ([eea3081](https://github.com/tinacms/tinacms/commit/eea3081ce8ad65b773b6843d60604bb4cd389576))
- **@tinacms/core:** cms.media async methods dispatch events ([9196bdf](https://github.com/tinacms/tinacms/commit/9196bdff6723f64e18426f90208837bfb1a93ec1))
- **@tinacms/core:** MediaStore#previewSrc accepts fieldPath and formValues ([e2bf27b](https://github.com/tinacms/tinacms/commit/e2bf27b436b6fc6b5e0b359142fed352c10fb2e0))
- **@tinacms/core:** promoted @tinacms/media classes to core ([5288dc1](https://github.com/tinacms/tinacms/commit/5288dc175db068a2b3cf5800bee66aa180369d92))
- **@tinacms/core:** the MediaStore interface has a delete method ([4c1cf5a](https://github.com/tinacms/tinacms/commit/4c1cf5af1b2b10143bf5c2aa4858b108507b3028))
- **@tinacms/events:** EventBus#subscribe can accept an array of event names ([63ef4db](https://github.com/tinacms/tinacms/commit/63ef4dbd5b17ccbae655b4d9f4962d08b288467f))
- **@tinacms/fields:** clicking on ImageField opens the media picker ui ([7bb8fdb](https://github.com/tinacms/tinacms/commit/7bb8fdb91f482ab5ec307bbffdbc31f4fcc16e08))
- **@tinacms/fields:** ImageFieldPlugin matches new MediaStore#previewSrc api ([76e5b04](https://github.com/tinacms/tinacms/commit/76e5b04151582087ec6538ebadf65fe6ad2ca5b7))
- **@tinacms/fields:** ImageUpload parse returns the whole media object ([94ee917](https://github.com/tinacms/tinacms/commit/94ee917e19061828ddbbb857dc1513eb61da49f5)), closes [#1453](https://github.com/tinacms/tinacms/issues/1453)
- **@tinacms/fields:** the uploadDir function is now optional for image fields ([6095caf](https://github.com/tinacms/tinacms/commit/6095caf5355c811f6bbb9cdd2a7e640b82ae4735))
- **@tinacms/git-client:** GitMediaStore implements delete ([6b6efdb](https://github.com/tinacms/tinacms/commit/6b6efdbb8bd1c72cd5a6045bb832c19b6c105f3c))
- **@tinacms/git-client:** the GitMediaStore implements list ([26ceadd](https://github.com/tinacms/tinacms/commit/26ceadd7b67fe0abf0085f647fad454e274f4c5b))
- **@tinacms/icons:** adds media mgr folder & file icons ([81f1191](https://github.com/tinacms/tinacms/commit/81f1191886088288b71a957c4c984983eaa0dfdd))
- **@tinacms/media:** add optional previewSrc to Media interface ([664701e](https://github.com/tinacms/tinacms/commit/664701e912f11c554f7852eed608f28f3dafd00e))
- **@tinacms/media:** added id property to Media interface ([95ce72c](https://github.com/tinacms/tinacms/commit/95ce72ca76c69d4838efdef0cc196957d9107ff6))
- **@tinacms/media:** cms.media has all of the MediaStore methods ([97b080b](https://github.com/tinacms/tinacms/commit/97b080b90f246f312aefc11d396ec2cde207ef36)), closes [#1458](https://github.com/tinacms/tinacms/issues/1458)
- **@tinacms/media:** cms.media has all of the MediaStore methods ([6109f74](https://github.com/tinacms/tinacms/commit/6109f74b41c315b4800a7764e26b92e3f61f1197)), closes [#1458](https://github.com/tinacms/tinacms/issues/1458)
- **@tinacms/media:** The media in the store can be listed ([8704c29](https://github.com/tinacms/tinacms/commit/8704c290d6161606fb8dae661714dd64d720c686)), closes [#1451](https://github.com/tinacms/tinacms/issues/1451)
- **@tinacms/media:** the Media interface now has a 'type' prop that can be 'file' or 'dir' ([1a867cf](https://github.com/tinacms/tinacms/commit/1a867cfb53b5e6accbdc5e63a41c401fee2ed2d7))
- **next-tinacms-github:** Add NextGithubMediaStore ([357dcd8](https://github.com/tinacms/tinacms/commit/357dcd85a12e1687fa03104ada2e4a1ba3bba49b))
- **react-tinacms-github:** add GithubClient#commit(branch, repo?) ([d62bc3b](https://github.com/tinacms/tinacms/commit/d62bc3bc5cd5dd06935ec8237005039eb817bfee))
- **react-tinacms-github:** GithubMediaStore implements MediaStore#delete ([1c5ded9](https://github.com/tinacms/tinacms/commit/1c5ded9334749ac7905068546eec397a886a9063))
- **react-tinacms-github:** GithubMediaStore implements MediaStore#list ([a963189](https://github.com/tinacms/tinacms/commit/a963189740e9ded9d753fb5bec95a7011350b3a7))
- **react-tinacms-inline:** adds inline image style extension ([f4348e5](https://github.com/tinacms/tinacms/commit/f4348e583f0ec794b8b45483cd8456ab4e9160a2))
- **react-tinacms-inline:** image children only receive src ([9b48aa6](https://github.com/tinacms/tinacms/commit/9b48aa68874fdfe9ce567f47b5945a9365c888aa))
- **react-tinacms-inline:** inline img accepts alt ([e576838](https://github.com/tinacms/tinacms/commit/e5768385f878418353fa1c108632290e4c3f8c1a))
- **react-tinacms-inline:** InlineField accepts parse and format functions ([8d62b8e](https://github.com/tinacms/tinacms/commit/8d62b8e65cae511118c16a4f4427672b0812bcd9))
- **react-tinacms-inline:** InlineImage parse accepts a Media rather then a string ([3be3e16](https://github.com/tinacms/tinacms/commit/3be3e166b83e1ba60a041898c9b0165310cbb623))
- **react-tinacms-inline:** InlineImageField#previewSrc matches MediaStore API ([aeb0cd5](https://github.com/tinacms/tinacms/commit/aeb0cd5f5a717f035074e1406556b621c5e874f3))
- **react-tinacms-inline:** uploadDir on InlineImageField is now optional ([4259804](https://github.com/tinacms/tinacms/commit/425980478046e50620ce2b6441b4db68d1e0223c))
- **react-tinacms-strapi:** the StrapiMediaStore implements MediaStore#delete ([157d1fc](https://github.com/tinacms/tinacms/commit/157d1fcc7f86e5a1064875d68cad743cb4c1a08d))
- **react-tinacms-strapi:** the StrapiMediaStore now implements MediaStore#list ([d851296](https://github.com/tinacms/tinacms/commit/d851296fb899e87394c358bba20c436a74e5c238))
- **tinacms:** add media manager UI ([4f0cf96](https://github.com/tinacms/tinacms/commit/4f0cf9631afe68d0b5204aabb66085a2a2291b24))
- **tinacms:** added a default MediaManager screen ([dc33594](https://github.com/tinacms/tinacms/commit/dc33594c227afd884d5078af53f9340277734bca))
- **tinacms:** an alerts map can be provided to TinaCMS constructor ([fcee016](https://github.com/tinacms/tinacms/commit/fcee01604bb6ae08b126c7903c8d90601adf92e5))
- **tinacms:** apis can define their own event-to-alerts map ([24a9305](https://github.com/tinacms/tinacms/commit/24a93059a0abe7930a4f301fa447de162d19fd5c))

# [0.30.0](https://github.com/tinacms/tinacms/compare/v0.29.0...v0.30.0) (2020-09-10)

### Bug Fixes

- link modal keybaord shortcut ([96de0de](https://github.com/tinacms/tinacms/commit/96de0de62710dc897f6f5de6c615a49a1f8e6829))
- wysiwym image modal issues ([4473310](https://github.com/tinacms/tinacms/commit/447331019878289471a2f0e885d47b7e8a05c4b7))
- wysiwym table and link modal ([5965e12](https://github.com/tinacms/tinacms/commit/5965e122b3855defedbba45ab92b2a917af9cd70))

### Features

- **react-tinacms-github:** introduce useGithubClient hook ([2111d70](https://github.com/tinacms/tinacms/commit/2111d70c289684d06eec3aeff89e7a76bd618a23)), closes [#1436](https://github.com/tinacms/tinacms/issues/1436)
- keyboard shortcut for toggle editor mode ([03074ac](https://github.com/tinacms/tinacms/commit/03074ac36ca6d542e29883b7f0f21957d9a4b771))

# [0.29.0](https://github.com/tinacms/tinacms/compare/v0.28.0...v0.29.0) (2020-08-25)

### Bug Fixes

- add parse function ([4add855](https://github.com/tinacms/tinacms/commit/4add855928e3557fc9c97985399fe68b640e5931))
- **react-tinacms-inline:** preview src passes form values ([e376424](https://github.com/tinacms/tinacms/commit/e37642482c78182d72bf74eb34e3f1a2a311675f))

### Features

- **next-tinacms-json:** remove deprecated apis ([0a03345](https://github.com/tinacms/tinacms/commit/0a033450d6b6a1137b5a1865daf77c1e24032534))
- **next-tinacms-markdown:** sunset outdated APIs ([8b6e90a](https://github.com/tinacms/tinacms/commit/8b6e90a0405cc031ec46da39dc5e8e640c36d5c6))

# [0.28.0](https://github.com/tinacms/tinacms/compare/v0.27.3...v0.28.0) (2020-08-17)

### Bug Fixes

- multiple instances of components not accepting multiple child elements ([cbbb03d](https://github.com/tinacms/tinacms/commit/cbbb03df7d1c98450355b93e1189cda8811aa5a3))
- **react-tinacms-editor:** prosemirror image plugin is only added if imageProps was was defined ([c29cc4c](https://github.com/tinacms/tinacms/commit/c29cc4c18e1a6b3ca3395cf51f3d274af2be58fb))
- **react-tinacms-editor:** renamed previewUrl to previewSrc to make it consistent with InlineImage component and ImageFieldPlugin ([db55a85](https://github.com/tinacms/tinacms/commit/db55a852ab445f7553b68bf1a9a62d5484afcb9f))
- **react-tinacms-editor:** seevral UX issues addressed for tables, headings, and the link modal ([#1393](https://github.com/tinacms/tinacms/issues/1393)) ([28cfaec](https://github.com/tinacms/tinacms/commit/28cfaec04cfdb63376b04e23113911af00ddad9c))
- **react-tinacms-editor:** when InlineWysiwyg is not given imageProps then images are disabled ([ebefdf1](https://github.com/tinacms/tinacms/commit/ebefdf1a914cdb9a2e2bd0f8ffbfc1dfea2fef52))
- **react-tinacms-github:** an authorized user trying access a deleted branch will be prompted to switch back to the base branch ([137b5ee](https://github.com/tinacms/tinacms/commit/137b5ee01ef289cf3a26ceae2e2d0c327fd9b1ea))
- **react-tinacms-github:** improved error modals on 404s ([4a998fc](https://github.com/tinacms/tinacms/commit/4a998fc79436b504fcfada4c80de1249b34a899a))

### Features

- **@tinacms/core:** events from APIs are dispatched to the entire CMS ([1a47d0b](https://github.com/tinacms/tinacms/commit/1a47d0b85ac0aedc65a26caed5fea6dc5d0f7f2a))
- **@tinacms/fields:** ImageFieldPlugin will default to useing cms.media.store for previewSrc ([a4f377c](https://github.com/tinacms/tinacms/commit/a4f377c90f7fc8b895c9e116a56a2752d8a9ae93))
- **@tinacms/media:** MediaStore's can have an optional previewSrc method ([e4024d2](https://github.com/tinacms/tinacms/commit/e4024d2404dd833617fed5715c3d1f8fb397ee46))
- **react-tinacms-editor:** by default InlineWysiwyg will use cms.media.store for the previewUrl ([d7dbda7](https://github.com/tinacms/tinacms/commit/d7dbda72954a28c3e990790b3656485e89004c37))
- **react-tinacms-editor:** InlineWysiwyg expects imageProps.parse to modify the filename before inserting the img tag ([1738671](https://github.com/tinacms/tinacms/commit/17386712e449c21355e44b928f7b06f9bf90c222))
- **react-tinacms-github:** GithubMediaStore implements previewSrc ([325fdb4](https://github.com/tinacms/tinacms/commit/325fdb4ddda710c5b7baf2e0ab3ac4027f572905))
- **react-tinacms-inline:** InlineImage defaults to using cms.media.store.previewSrc ([d050e63](https://github.com/tinacms/tinacms/commit/d050e6301bc2a7e38681d1fb72b31b36283bf920))
- **react-tinacms-inline:** InlineImage now works with an async previewSrc ([91b8995](https://github.com/tinacms/tinacms/commit/91b8995f4741f3aed8aee2fd045242623bc86221))
- **react-tinacms-inline:** InlineText and InlineTextarea will render children instead of input.value when cms.disabled ([1ee29ab](https://github.com/tinacms/tinacms/commit/1ee29abaf526168b06af232ff31bf1fc5bbc01e3))
- **react-tinacms-inline:** InlineTextarea now accepts placeholder ([1be2566](https://github.com/tinacms/tinacms/commit/1be2566a5177cdbf4a439d80ba0ff8d048528d76))
- **react-tinacms-strapi:** StrapiMediaStore implements previewSrc ([fe5df7d](https://github.com/tinacms/tinacms/commit/fe5df7d804d2c0d1b8f21283dd56ab7132d1414d))

## [0.27.3](https://github.com/tinacms/tinacms/compare/v0.27.2...v0.27.3) (2020-08-10)

### Bug Fixes

- **react-tinacms-inline:** BlocksControls always returns a JSX Element ([36d84f6](https://github.com/tinacms/tinacms/commit/36d84f62316bd8d7683a5c317ab3fc4a5a3ee9cd))

## [0.27.2](https://github.com/tinacms/tinacms/compare/v0.27.1...v0.27.2) (2020-08-10)

### Bug Fixes

- **react-tinacms-inline:** BlocksControlsProps#children is not optional ([9ca8bc9](https://github.com/tinacms/tinacms/commit/9ca8bc95ce0751fe5713449d11f89392568540cf))

## [0.27.1](https://github.com/tinacms/tinacms/compare/v0.27.0...v0.27.1) (2020-08-10)

### Bug Fixes

- switch from ReactNode to ReactChild for various props ([a585ce9](https://github.com/tinacms/tinacms/commit/a585ce990de45a499ff8befd93554133768e5e43))

# [0.27.0](https://github.com/tinacms/tinacms/compare/v0.26.0...v0.27.0) (2020-08-10)

### Bug Fixes

- **@tinacms/react-sidebar:** adds aria label to sidebar toggle button ([fc2957a](https://github.com/tinacms/tinacms/commit/fc2957a8aa15623c8862aa53d00b4309244ea696))
- **@tinacms/react-sidebar:** sidebar doesn't render when cms is disabled ([c24556d](https://github.com/tinacms/tinacms/commit/c24556d9aab40dfd684e11ccf4d3180c6bd26820))
- **next-tinacms-github:** auth handler sends 500 error when missing signing key ([90b5916](https://github.com/tinacms/tinacms/commit/90b591676c8bdc4b688ac7350a679709f0381f21))
- **next-tinacms-github:** preview handler responds with 500 if signing key is missing ([31273f7](https://github.com/tinacms/tinacms/commit/31273f7acaea7687f577f8eb3961283bb1eb7840))
- **next-tinacms-github:** sends 500 with message if signing key is missing ([002ce35](https://github.com/tinacms/tinacms/commit/002ce356523ef9f6e39f8296827acac8924a3acb))
- **tinacms:** enabling cms with sidebar doesn't remount children ([1188dbf](https://github.com/tinacms/tinacms/commit/1188dbfa5bcaeb0ae9b832b15ad299b5c1ea4c01))

### Features

- **react-tinacms-editor:** InlineWysiwyg imageProps.upload now defaults to using the cms.media.store to upload images ([166f380](https://github.com/tinacms/tinacms/commit/166f380e886e88b9edc90948a4c2ca249244d6a3))
- **react-tinacms-editor:** InlineWysiwyg now accepts imageProps.directory ([f75d130](https://github.com/tinacms/tinacms/commit/f75d130855a24f5a3ccbbb6f19cef0a87e196ad3))
- **react-tinacms-inline:** InlineText now accepts a placeholder prop ([319d29f](https://github.com/tinacms/tinacms/commit/319d29f303bcb38286ec24982030327ec2a44f0f))
- **react-tinacms-inline:** previewUrl is now optionally async ([3aaead3](https://github.com/tinacms/tinacms/commit/3aaead34b759d3c8c12bbef75357a2e0925d2c10))

# [0.26.0](https://github.com/tinacms/tinacms/compare/v0.25.0...v0.26.0) (2020-08-03)

### Bug Fixes

- **gatsby-tinacms-git:** useGitForm#loadInitialValues does not run in production ([a42d50c](https://github.com/tinacms/tinacms/commit/a42d50c041941a06770551b66353c82b72cfddd5))
- **gatsby-tinacms-mdx:** useMdxForm#loadInitialValues does not run in production ([e0c2275](https://github.com/tinacms/tinacms/commit/e0c227542970b0a42be60ec8573216d7a54e9c1e))
- **next-tinacms-json:** useJsonForm#loadInitialValues does not run when cms is disabled ([9fbd8e8](https://github.com/tinacms/tinacms/commit/9fbd8e83d1765a97b747fca441869538137488bb))
- **next-tinacms-markdown:** useMarkdownForm#loadInitialValues does not run when cms is disabled ([3292bf4](https://github.com/tinacms/tinacms/commit/3292bf4bae15ee3c47f474ce46555a1491249d56))

### Features

- **@tinacms/forms:** useForm always runs loadInitialValues ([a624087](https://github.com/tinacms/tinacms/commit/a6240872ce18a514ac954f911f481664e71dbb52))
- **@tinacms/react-core:** a new CMS is disabled by default ([ef3ac08](https://github.com/tinacms/tinacms/commit/ef3ac08d2a701cd1b123cf303b69371f16bf81cc))
- add focus ring to inline wysiwyg ([2768afd](https://github.com/tinacms/tinacms/commit/2768afd1b69bdef2a3dce38dab6b71d002ddbad6))
- tooltips for menubar options ([bd06f11](https://github.com/tinacms/tinacms/commit/bd06f113e750b9845ed7e3a34c519562e665c99d))

# [0.25.0](https://github.com/tinacms/tinacms/compare/v0.24.0...v0.25.0) (2020-07-27)

### Bug Fixes

- **react-tinacms-editor**: table delete icon should be visible only if whole table is selected ([dd3313b](https://github.com/tinacms/tinacms/commit/dd3313b8215ab30ccbdfd377bbd92883570ad8a9))
- **react-tinacms-editor**: table row add delete icons overlapping ([cfa9949](https://github.com/tinacms/tinacms/commit/cfa9949c4580d09481362071e562fd7f795496d0))
- **react-tinacms-editor**: UX improvements hide title input from link modal ([6e5ab20](https://github.com/tinacms/tinacms/commit/6e5ab20631435508b1e16f7261b772008c3dda1d))

### Features

- **react-tinacms-github:** added github delete action docs to readme ([dc58e59](https://github.com/tinacms/tinacms/commit/dc58e590f0fdc4874ed243989d83a795e4930d88))
- **next-tinacms-github:** getGithubFile let's you fetch and parse a file without the entire preview props ([17cb428](https://github.com/tinacms/tinacms/commit/17cb42840b080a671d69ca91ee2b85a57fec6db9))

### New Packages

- **react-tinacms-strapi:** a new package for using Strapi as a backend for your website. [Checkout this guide to learn more!](https://tinacms.org/guides/nextjs/tina-with-strapi/overview)
