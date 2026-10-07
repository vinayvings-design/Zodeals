import { createContext, useContext, useState, useEffect } from "react";
import PinCodeModal from "../Components/MainPage/Pincodemodel";
const ModalContext = createContext(null);
export const ModalProvider = ({ children }) => {
    const [pinModalOpen, setPinModalOpen] = useState(false);
    const [IsLoginden, setIsLogiden] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const pin = localStorage.getItem("userPinCode");
        if (token && !pin) {
            setPinModalOpen(true);
        }
    }, [IsLoginden]);
    const openPinModal = () => setPinModalOpen(true);
    const closePinModal = () => setPinModalOpen(false);
    return (
        <ModalContext.Provider value={{ openPinModal,setIsLogiden }}>
            {children}
            <PinCodeModal
                open={pinModalOpen}
                onClose={closePinModal}
                onPinSubmit={(pin) => {
                    localStorage.setItem("userPinCode", pin);
                    closePinModal();
                    window.location.reload();
                }}
            />
        </ModalContext.Provider>
    );
};
export const useModal = () => useContext(ModalContext);
