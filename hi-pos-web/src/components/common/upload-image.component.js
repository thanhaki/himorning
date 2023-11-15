import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
export const ImageUpload = (props) => {
    const { selectedFile, setSelectedFile, urlImage, acceptType, isShowNameFile, icon, title, downloadComponent } = props;
    const [preview, setPreview] = useState();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid container item xs="auto">
                    {title != null && <Typography display="inline" variant="body1">{title}</Typography>}
                    <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden
                            accept={acceptType ? acceptType : "image/*"}
                            type="file"
                            onChange={onSelectFile} />
                        {icon === null ? <PhotoCamera /> : icon}
                    </IconButton>
                    {selectedFile === null && urlImage && <img src={urlImage} width={"100px"} />}

                    {/* Case show filename */}
                    {isShowNameFile && selectedFile &&
                        <Grid item sx={{maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Typography variant='caption' sx={{ wordBreak: 'break-word' }}>
                                {selectedFile.name}
                            </Typography>
                        </Grid>
                    }
                    {/* Case show preview image */}
                    {!isShowNameFile && selectedFile && <img src={preview} width={"100px"} />}
                    {downloadComponent != null && !selectedFile && downloadComponent}
                </Grid>
            </Grid>
        </Box>
    )
}