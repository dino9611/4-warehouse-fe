import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

function AdminSimpleSkeleton() {
    return (
        <Stack spacing={3}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "48px", width: "20%"}}/>
                <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "48px", width: "25%"}}/>        
            </div>
            <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "320px", width: "100%"}} />
            <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "320px", width: "100%"}} />
            <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "320px", width: "100%"}} />
            <div style={{display: "flex", columnGap: "24px", justifyContent: "flex-end"}}>
                <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "48px", width: "160px"}} />
                <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "48px", width: "160px"}} />
            </div>
        </Stack>   
    )
}

export default AdminSimpleSkeleton;