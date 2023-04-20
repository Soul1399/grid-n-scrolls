export class RealizedDisplayConfig {
    constructor(
        public extendedMode: boolean = true,
        public visibleOtherSections: { [section: string]: string[] } = {}
    ) {}
}
