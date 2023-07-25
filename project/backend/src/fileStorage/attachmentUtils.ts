import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export class AttachmentUtils {

    constructor(
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }


    async createAttachmentURL(taskGroupId: string) {
        var imageUrl = `https://${this.bucketName}.s3.amazonaws.com/${taskGroupId}`
        return imageUrl
    }

    getAttachmentUrl(taskGroupId: string) {
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: taskGroupId,
            Expires: this.urlExpiration
        })
    }
}
