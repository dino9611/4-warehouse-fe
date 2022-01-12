import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

function AdminSkeletonSimple() {
    return (
        <Stack spacing={3}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "3rem", width: "20%"}}/>     
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "3rem", width: "20%"}}/>
                <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "3rem", width: "25%"}}/>        
            </div>
                <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "80vh", width: "100%"}} />
            <div style={{display: "flex", columnGap: "24px", justifyContent: "center"}}>
                <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "3rem", width: "30%"}} />
            </div>
        </Stack>    
    )
}

export default AdminSkeletonSimple;