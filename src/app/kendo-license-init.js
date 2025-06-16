import { setLicenseKey } from '@progress/kendo-licensing';

export const initKendoLicense = () => {
    const licenseKey = process.env.NEXT_PUBLIC_KENDO_UI_LICENSE || '';
    if (licenseKey) {
        setLicenseKey(licenseKey);
    }
};