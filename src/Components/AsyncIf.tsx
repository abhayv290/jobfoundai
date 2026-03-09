import { FC, ReactNode, Suspense } from "react";

interface Props {
    condition: () => Promise<boolean>;
    children: ReactNode;
    loadingFallback?: ReactNode;
    otherwise?: ReactNode;
}

const AsyncIf: FC<Props> = ({ condition, children, loadingFallback, otherwise }) => {
    return (
        <Suspense fallback={loadingFallback}>
            <SuspendedComponent condition={condition} otherwise={otherwise}>
                {children}
            </SuspendedComponent>
        </Suspense>
    )
}

export default AsyncIf


async function SuspendedComponent({ children, condition, otherwise }: Omit<Props, 'loadingFallback'>) {
    return await condition() ? children : otherwise;
}